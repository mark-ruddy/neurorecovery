# NeuroRecovery
## Report Generation
1. `pandoc report_neurorecovery.md -o dist/report_neurorecovery.docx`
2. Manually add first page from template in libreoffice
3. Export as pdf to `dist/report_neurorecovery.pdf` - this is report generated

## Deployment with Tilt CI/CD
The NeuroRecovery app is tested and deployed with [Tilt CI/CD](https://tilt.dev/).  

This form of deployment requires some upfront cost. Once the environment is configured with a Kubernetes cluster and `tilt up` is running though, the application will be automatically deployed in a consistent manner, and the developer receives immediate CI/CD feedback for any code changes.  

### Steps to Deploy
By completing the below steps the environment will be ready to deploy the application on a Kubernetes cluster:

- [Install Tilt CI/CD](https://docs.tilt.dev/install.html)
- Start a Kubernetes cluster on your local machine such as [K3s](https://k3s.io/) which provides a Load Balancer by default. If using K3s, you may have to change the `traefik-config.yaml` to allow usage of port 80, see [Load Balance Rust](https://github.com/mark-ruddy/load_balance_rust) for more details.
- Install `kubectl`, `helm`, `podman` and `buildah` locally, on Fedora this would be: `sudo dnf install kubernetes helm podman buildah`.
  - On other Linux distros(RHEL8, Ubuntu, etc.) view these links to install: [Podman/Buildah install](https://podman.io/getting-started/installation), [Kubectl binary install](https://kubernetes.io/docs/tasks/tools/install-kubectl-linux/), [Helm binary install](https://helm.sh/docs/intro/install/)
- Deploy an image registry on the Kubernetes cluster, see [setting up any Image Registry](https://docs.tilt.dev/personal_registry.html) from Tilt, an example of deploying a [registry from scratch](custom_image_registry.md). Ensure to apply cluster registry yaml file so Tilt identifies it.
- Clone the repo into the deployment server: `git clone git@github.com:mark-ruddy/neurorecovery.git`
- Add a `.env` file to the `backend` directory, `touch backend/.env` - add your own keys in this format:

```
NEURORECOVERY_MONGODB_PASS=au5maduk55
```

- If `NEURORECOVERY_MONGODB_PASS` is changed to anything other than `au5maduk55`, then `export NEURORECOVERY_MONGODB_PASS=<YOUR_PASS>` before starting Tilt and comment out line 2 in the `Tiltfile`: `os.putenv('NEURORECOVERY_MONGODB_PASS', 'au5maduk55')`.
- If this is an internet-exposed deployment, then set the backend URL in the frontends `BackendService`, since the Angular JS will be delivered to the users browser it must query the internet-exposed backend URL:

```
// NOTE: In production this URL should be the host server address
public backendBaseUrl = 'http://neurorecovery-app.xyz:8080'; 
```

- Run `tilt up` and visit `localhost:10350`, if the local dependencies are not installed, then there will be some failing tests - this is OK if the goal is to get the deployment up only.
- Run `kubectl get all -n neurorecovery` and `helm ls -a -n neurorecovery` to view the deployed resources.

Once the resources have been compiled and built into container images to be deployed on the cluster, they will be available on the host node at:

- Frontend Server LoadBalancer: http://localhost:80
- Backend Server LoadBalancer: http://localhost:8080
- MongoDB ClusterIP: [mongodb://10.43.252.173:27017](mongodb://10.43.252.173:27017)

To connect to MongoDB by shell: `mongo --host 10.43.252.173 -u root -p <YOUR_PASS>`  

### Production Deployment
For a production deployment some extra steps may be considered:

- Restricting CORS settings for the backend server to only accepting requests from the frontend server:
  - Modify the `layer(CorsLayer::permissive())` line  in the `create_router()` function in `main.rs` of the backend code.
