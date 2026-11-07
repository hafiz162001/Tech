import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as ecs from 'aws-cdk-lib/aws-ecs';
import * as ecsPatterns from 'aws-cdk-lib/aws-ecs-patterns';
import * as rds from 'aws-cdk-lib/aws-rds';
import * as elasticache from 'aws-cdk-lib/aws-elasticache';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront';
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins';

export class EternaPlatformInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // 1. VPC with 2 Availability Zones
    const vpc = new ec2.Vpc(this, 'EternaVpc', {
      maxAzs: 2,
      natGateways: 1,
    });

    // 2. AWS S3 Bucket for Resume & Payslip storage with encryption
    const documentsBucket = new s3.Bucket(this, 'EternaDocumentsBucket', {
      bucketName: `eterna-platform-documents-${this.account}`,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      removalPolicy: cdk.RemovalPolicy.RETAIN,
      cors: [
        {
          allowedMethods: [s3.HttpMethods.GET, s3.HttpMethods.PUT, s3.HttpMethods.POST],
          allowedOrigins: ['*'],
          allowedHeaders: ['*'],
        },
      ],
    });

    // 3. MySQL RDS Aurora Cluster
    const dbCluster = new rds.DatabaseCluster(this, 'EternaDatabaseCluster', {
      engine: rds.DatabaseClusterEngine.auroraMysql({
        version: rds.AuroraMysqlEngineVersion.VER_3_04_0,
      }),
      vpc,
      vpcSubnets: {
        subnetType: ec2.SubnetType.PRIVATE_ISOLATED,
      },
      credentials: rds.Credentials.fromGeneratedSecret('eterna_admin'),
      defaultDatabaseName: 'eterna_db',
      writer: rds.ClusterInstance.provisioned('WriterInstance', {
        instanceType: ec2.InstanceType.of(ec2.InstanceClass.T4G, ec2.InstanceSize.MEDIUM),
      }),
    });

    // 4. Redis ElastiCache Subnet Group & Replication Group
    const redisSubnetGroup = new elasticache.CfnSubnetGroup(this, 'EternaRedisSubnets', {
      description: 'Subnet group for Eterna Redis Cluster',
      subnetIds: vpc.privateSubnets.map((subnet) => subnet.subnetId),
    });

    const redisCluster = new elasticache.CfnReplicationGroup(this, 'EternaRedisCache', {
      replicationGroupDescription: 'Eterna Redis Cache for Talent Profiles and Rate Caching',
      cacheNodeType: 'cache.t4g.small',
      engine: 'redis',
      numCacheClusters: 2,
      automaticFailoverEnabled: true,
      cacheSubnetGroupName: redisSubnetGroup.ref,
    });

    // 5. ECS Cluster & Fargate Service for Spring Boot API
    const ecsCluster = new ecs.Cluster(this, 'EternaEcsCluster', {
      vpc,
    });

    const apiService = new ecsPatterns.ApplicationLoadBalancedFargateService(this, 'EternaApiService', {
      cluster: ecsCluster,
      cpu: 512,
      memoryLimitMiB: 1024,
      desiredCount: 2,
      taskImageOptions: {
        image: ecs.ContainerImage.fromAsset('../../backend'),
        containerPort: 8080,
        environment: {
          SPRING_PROFILES_ACTIVE: 'prod',
          AWS_S3_BUCKET: documentsBucket.bucketName,
          REDIS_HOST: redisCluster.attrPrimaryEndPointAddress,
        },
      },
      publicLoadBalancer: true,
    });

    documentsBucket.grantReadWrite(apiService.taskDefinition.taskRole);
    dbCluster.connections.allowDefaultPortFrom(apiService.service);

    // 6. CloudFront Distribution for Web App CDN
    const webDistribution = new cloudfront.Distribution(this, 'EternaWebDistribution', {
      defaultBehavior: {
        origin: new origins.HttpOrigin(apiService.loadBalancer.loadBalancerDnsName),
        viewerProtocolPolicy: cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
      },
      comment: 'Eterna Global Platform CloudFront Distribution',
    });

    new cdk.CfnOutput(this, 'CloudFrontUrl', {
      value: webDistribution.distributionDomainName,
      description: 'CloudFront URL for Eterna Platform',
    });
  }
}
