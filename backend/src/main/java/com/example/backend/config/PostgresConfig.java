package com.example.backend.config;

import com.atomikos.jdbc.AtomikosDataSourceBean;
import org.postgresql.xa.PGXADataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
public class PostgresConfig {

    @Bean(name = "postgresDataSource")
    public DataSource postgresDataSource() {
        PGXADataSource xaDataSource = new PGXADataSource();
        xaDataSource.setUrl("jdbc:postgresql://localhost:5432/is-lab1");
        xaDataSource.setUser("postgres");
        xaDataSource.setPassword("com191084");

        AtomikosDataSourceBean dataSource = new AtomikosDataSourceBean();
        dataSource.setXaDataSource(xaDataSource);
        dataSource.setUniqueResourceName("postgresDS");

        return dataSource;
    }
}
