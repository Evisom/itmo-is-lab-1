FROM openjdk:17-jdk-slim

COPY . /app

WORKDIR /app 

RUN  ./gradlew build   

ENTRYPOINT ["java", "-jar" ,"build/libs/backend-0.0.1-SNAPSHOT.war"]

EXPOSE 3000