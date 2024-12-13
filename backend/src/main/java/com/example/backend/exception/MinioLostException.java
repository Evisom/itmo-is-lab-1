package com.example.backend.exception;

public class MinioLostException extends RuntimeException{
    public MinioLostException(String message){
        super(message);
    }
}
