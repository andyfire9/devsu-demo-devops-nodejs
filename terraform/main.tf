# Terraform configuration for cloud infrastructure
# This example uses Azure AKS, but can be adapted for AWS EKS or GCP GKE

terraform {
  required_version = ">= 1.0"
  
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 3.0"
    }
    kubernetes = {
      source  = "hashicorp/kubernetes"
      version = "~> 2.0"
    }
  }
}

provider "azurerm" {
  features {}
}

# Resource Group
resource "azurerm_resource_group" "main" {
  name     = "rg-devops-exercise"
  location = var.location
}

# Maquina virtual
resource "azurerm_virtual_network" "main" {
  name                = "vnet-devops-exercise"
  address_space       = ["10.0.0.0/16"]
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
}

# Subnet para AKS
resource "azurerm_subnet" "aks" {
  name                 = "subnet-aks"
  resource_group_name  = azurerm_resource_group.main.name
  virtual_network_name = azurerm_virtual_network.main.name
  address_prefixes     = ["10.0.1.0/24"]
}

# AKS Cluster
resource "azurerm_kubernetes_cluster" "main" {
  name                = "aks-devops-exercise"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  dns_prefix          = "devopsexercise"

  default_node_pool {
    name       = "default"
    node_count = 2
    vm_size    = "Standard_D2_v2"
    
    enable_auto_scaling = true
    min_count          = 2
    max_count          = 5
  }

  identity {
    type = "SystemAssigned"
  }

  network_profile {
    network_plugin    = "azure"
    load_balancer_sku = "standard"
  }

  addon_profile {
    http_application_routing {
      enabled = true
    }
    
    oms_agent {
      enabled = true
      log_analytics_workspace_id = azurerm_log_analytics_workspace.main.id
    }
  }
}

# Log A. Workspace
resource "azurerm_log_analytics_workspace" "main" {
  name                = "log-devops-exercise"
  location            = azurerm_resource_group.main.location
  resource_group_name = azurerm_resource_group.main.name
  sku                 = "PerGB2018"
  retention_in_days   = 30
}

# Container Registry
resource "azurerm_container_registry" "main" {
  name                = "acrdevopsexercise"
  resource_group_name = azurerm_resource_group.main.name
  location            = azurerm_resource_group.main.location
  sku                 = "Basic"
  admin_enabled       = true
}

# Role Assignment para aks
resource "azurerm_role_assignment" "aks_acr" {
  principal_id                     = azurerm_kubernetes_cluster.main.kubelet_identity[0].object_id
  role_definition_name             = "AcrPull"
  scope                           = azurerm_container_registry.main.id
  skip_service_principal_aad_check = true
}