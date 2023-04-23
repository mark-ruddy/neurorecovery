### Container Registry with Helm on localhost:30000 NodePort
Instead of running the container registry with Podman, it can be far better to run it in the K8s cluster through a helm chart:
```
helm repo add twuni https://helm.twun.io
helm install registry twuni/docker-registry --set service.type=NodePort --set service.nodePort=30000
```

Add the registry references to the `/etc/containers/registries.conf` file:

```
unqualified-search-registries = ["localhost:30000", ...]

[[registry]]
location="localhost:30000"
insecure=true
```

For [Tilt](https://tilt.dev), you may have to apply a cfgmap to the cluster indicating the default registry to use - `kubectl apply cluster_registry.yaml`
