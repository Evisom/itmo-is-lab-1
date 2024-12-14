package com.example.backend.config;

import io.minio.MinioClient;
import io.minio.PutObjectArgs;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.transaction.xa.XAException;
import javax.transaction.xa.XAResource;
import javax.transaction.xa.Xid;
import java.io.InputStream;

public class MinioXAResource implements XAResource {
    private static final Logger logger = LoggerFactory.getLogger(MinioXAResource.class);
    private final MinioClient minioClient;

    public MinioXAResource(MinioClient minioClient) {
        this.minioClient = minioClient;
    }

    @Override
    public void commit(Xid xid, boolean onePhase) {
        logger.info("Commit transaction: " + xid);
        // Commit logic for MinIO if needed
    }

    @Override
    public void rollback(Xid xid) {
        logger.info("Rollback transaction: " + xid);
        // Rollback logic for MinIO if needed
    }

    @Override
    public boolean setTransactionTimeout(int seconds) throws XAException {
        return false;
    }

    @Override
    public void start(Xid xid, int flags) {
        logger.info("Start transaction: " + xid);
    }

    @Override
    public void end(Xid xid, int flags) {
        logger.info("End transaction: " + xid);
    }

    @Override
    public void forget(Xid xid) throws XAException {

    }

    @Override
    public int getTransactionTimeout() throws XAException {
        return 0;
    }

    @Override
    public boolean isSameRM(XAResource xares) throws XAException {
        return this == xares;
    }

    @Override
    public int prepare(Xid xid) throws XAException {

        return XA_OK;
    }

    @Override
    public Xid[] recover(int flag) throws XAException {
        return new Xid[0];
    }


}
