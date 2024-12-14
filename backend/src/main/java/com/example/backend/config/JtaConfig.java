package com.example.backend.config;

import com.atomikos.icatch.jta.UserTransactionImp;
import com.atomikos.icatch.jta.UserTransactionManager;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import jakarta.transaction.TransactionManager;
import jakarta.transaction.UserTransaction;

@Configuration
public class JtaConfig {

    @Bean
    public UserTransactionImp userTransaction() {
        UserTransactionImp userTransaction = new UserTransactionImp();
        userTransaction.setTransactionTimeout(300);
        return  userTransaction;
    }


}
