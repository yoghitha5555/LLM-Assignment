# Project Report

**Name:** [Yoghitha]
**Registration Number:** [2303917720522178]

---

## 1. Name of the Application
**Task Management (To-Do) API System**

## 2. Problem Addressed
In modern cloud-native environments, applications need to be highly scalable, resilient, and decoupled from underlying infrastructure. Traditional monolithic applications with dedicated databases often struggle with varying loads and are difficult to manage.

This project addresses these issues by implementing a scalable **Task Management API**. It solves the problem of manual scaling and infrastructure management by utilizing **Kubernetes** for container orchestration (ensuring high availability and automatic scaling) and a **Serverless Database** (MongoDB Atlas) to offload database management, allowing the database to scale seamlessly based on demand without provisioning servers.

## 3. Technologies Used
* **Programming Language / Runtime:** Node.js
* **Web Framework:** Express.js
* **Database:** MongoDB Atlas (Serverless Database)
* **ODM (Object Data Modeling):** Mongoose
* **Containerization:** Docker
* **Orchestration:** Kubernetes (Pods, Deployments, NodePort/LoadBalancer Services)

## 4. Project Structure
```text
k8s-crud-app/
│
├── package.json           # Node.js dependencies and scripts
├── server.js              # Entry point and Express API routes (CRUD)
├── Dockerfile             # Instructions to build the Docker image
├── .dockerignore          # Files to exclude from the Docker image
│
├── models/
│   └── Task.js            # Mongoose schema for the Task entity
│
└── k8s/
    ├── deployment.yaml    # Kubernetes manifest for replica sets and pods
    └── service.yaml       # Kubernetes manifest for LoadBalancer/NodePort
```

## 5. Extended Services (Kubernetes)
The application utilizes Kubernetes to provide extended services:
* **Kubepods (via Deployment):** The application runs across multiple Pod replicas to ensure high availability. The Deployment manages the state and restarts pods if they fail.
* **NodePort / LoadBalancer Service:** A Service is configured to expose the application to external traffic. It acts as a load balancer, distributing incoming requests evenly across the available Pods running the application.

## 6. Serverless DB Connection
The application connects to a Serverless Database (MongoDB Atlas) using a connection string URI. Serverless DB allows the application to perform robust CRUD operations (Create, Read, Update, Delete) without needing to manage database servers or clusters manually.

### CRUD Operations Implemented:
* **Create:** `POST /tasks` - Adds a new task to the serverless DB.
* **Read:** `GET /tasks` and `GET /tasks/:id` - Fetches tasks.
* **Update:** `PUT /tasks/:id` - Modifies an existing task.
* **Delete:** `DELETE /tasks/:id` - Removes a task from the database.

---
*(Note: Be sure to include your Code and Output Screenshots in your final document as requested by the assignment!)*
