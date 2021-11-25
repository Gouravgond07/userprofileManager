
const Config = require('../config/index');
const aws = require('aws-sdk');
aws.config.credentials = { 
    accessKeyId: Config.s3Config.accessKeyId,
    secretAccessKey: Config.s3Config.secretAccessKey,
}
aws.config.update({ region: Config.s3Config.region });
class S3Service {
    static getS3Object() {
        return new aws.S3();
    }

    /**
     * 
     * @param {String} key 
     * @returns {Promise<String>}
     */
    static async getImageUrlByKey(key) {
        try {
            const getBucketParams = {
                Bucket: Config.s3Config.bucket,
                Key: key
            };
            const s3 = this.getS3Object();
            return await s3.getSignedUrlPromise('getObject', getBucketParams)
        } catch (error) {
            throw error;
        }
    }
} 

module.exports = S3Service;