# [Backstage](https://backstage.io)

This is your newly scaffolded Backstage App, Good Luck!

To start the app, run:

```sh
yarn install
yarn dev
```


# Create a KIND Cluster with a Dapr Application

```
kind create cluster
```

```
helm repo add dapr https://dapr.github.io/helm-charts/
helm repo update
helm upgrade --install dapr dapr/dapr \
--version=1.14.4 \
--namespace dapr-system \
--create-namespace \
--wait
```

Install the application: 

```
helm install conference oci://docker.io/salaboy/conference-app --version v2.0.0
```

To access the application: 
```
kubectl port-forward svc/frontend 8080:80
```

Install the Dapr Dashboard:

```
helm install dapr-dashboard dapr/dapr-dashboard
```

To access the Dashboard: 

```
kubectl port-forward svc/dapr-dashboard 8081:8080
```

The Dapr Dashboard with the application running looks like this: 

![](imgs/1.png)
![](imgs/2.png)
![](imgs/3.png)
![](imgs/4.png)
![](imgs/5.png)
![](imgs/6.png)