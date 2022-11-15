# Setup Environment
os.putenv("NEURORECOVERY_MONGODB_PASS", "au5maduk55")

# Ensure a docker registry is running on the cluster with the cfgmap pointing to it
load('ext://helm_resource', 'helm_repo', 'helm_resource')
load('ext://namespace', 'namespace_inject')
allow_k8s_contexts('default')

k8s_yaml('cicd/namespace.yaml')
helm_repo('bitnami', 'https://charts.bitnami.com/bitnami', labels='Setup')

## Run neurorecovery backend tests which interact with the K8s cluster
## They will be run from a locally spawned backend server and access MongoDB through its ExternalIP
local_resource('Test Backend', cmd='cargo test --manifest-path=backend/Cargo.toml', labels='Test')

# Build and deploy components on the K8s cluster
## Build the API server container image
## buildah must be installed, usually bundled with podman 'sudo dnf install podman'
custom_build(
  'neurorecovery-backend',
  'buildah bud --build-arg NEURORECOVERY_MONGODB_PASS=%s -t $EXPECTED_REF backend && buildah push $EXPECTED_REF $EXPECTED_REF' % (os.getenv('NEURORECOVERY_MONGODB_PASS')),
  ['./neurorecovery_backend'],
  skips_local_docker=True,
)

helm_resource(
  'neurorecovery-backend-chart',
  'backend/neurorecovery-backend-chart',
  namespace='neurorecovery',
  labels='Deploy',
  flags=['--values', 'cicd/backend_chart_values.yaml'],
  image_deps=['neurorecovery-backend'],
  image_keys=[('image.repository', 'image.tag')],
)

custom_build(
  'neurorecovery-frontend',
  'buildah bud -t $EXPECTED_REF frontend && buildah push $EXPECTED_REF $EXPECTED_REF',
  ['./neurorecovery_frontend'],
  skips_local_docker=True,
)

helm_resource(
  'neurorecovery-frontend-chart',
  'frontend/neurorecovery-frontend-chart',
  namespace='neurorecovery',
  labels='Deploy',
  flags=['--values', 'cicd/frontend_chart_values.yaml'],
  image_deps=['neurorecovery-frontend'],
  image_keys=[('image.repository', 'image.tag')],
)

## Deploy MongoDB database
helm_resource(
  'mongodb',
  'bitnami/mongodb',
  namespace='neurorecovery',
  labels='Deploy',
  flags=['--values', 'cicd/mongodb_values.yaml', '--set', 'auth.rootPassword=%s' % (os.getenv('NEURORECOVERY_MONGODB_PASS'))],
)
