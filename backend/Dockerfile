# Use Maven + JDK to build
FROM maven:3.9.0-eclipse-temurin-17 AS build

WORKDIR /app

# Copy backend source code
COPY . .

# Build jar
RUN mvn clean package -DskipTests

# Use minimal JDK for running
FROM openjdk:17-jdk-alpine
WORKDIR /app

# Copy jar from build stage
COPY --from=build /app/target/notesapp-1.0.0.jar notes-backend.jar

EXPOSE 5000
ENTRYPOINT ["java","-jar","notes-backend.jar"]
