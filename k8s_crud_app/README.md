# Kubernetes Serverless DB CRUD Application

This is a Node.js Express application that performs CRUD operations on a serverless MongoDB database, containerized with Docker, and orchestrated using Kubernetes.

## Prerequisites
- Node.js (v18+)
- Docker
- Kubernetes Cluster (Minikube, Docker Desktop K8s, etc.)
- `kubectl` CLI

## Local Development
1. Install dependencies:
   ```bash
   npm install
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
   *Note: Ensure you set the `MONGODB_URI` environment variable if you want to connect to a real database.*

## Docker Build
To build the Docker image:
```bash
docker build -t your-dockerhub-username/k8s-crud-app:latest .
```
*(Replace `your-dockerhub-username` with your actual username)*

## Kubernetes Deployment
1. Update `k8s/deployment.yaml` with your built Docker image name.
2. Apply the deployment:
   ```bash
   kubectl apply -f k8s/deployment.yaml
   ```
3. Apply the service:
   ```bash
   kubectl apply -f k8s/service.yaml
   ```
4. Check the status:
   ```bash
   kubectl get pods
   kubectl get services
   ```
5. Access the application:
   If using Minikube:
   ```bash
   minikube service k8s-crud-app-service
   ```
   Or access directly at `http://localhost:30001` depending on your setup.

## API Endpoints
- `GET /health` : Health check endpoint
- `POST /tasks` : Create a new task (Requires body: `{ "title": "Task name" }`)
- `GET /tasks` : Get all tasks
- `GET /tasks/:id` : Get a single task by ID
- `PUT /tasks/:id` : Update a task
- `DELETE /tasks/:id` : Delete a task
