# PlantUML samples

```
@startuml
skinparam defaultTextAlignment center
skinparam monochrome true

skinparam rectangle<<l4>> {
  backgroundColor Transparent
  borderColor Transparent
  stereotypeFontColor Transparent
  shadowing false
}
hide <<l4>> stereotype

!define ICONURL https://raw.githubusercontent.com/Roemer/plantuml-office/master/office2014
!includeurl ICONURL/Devices/load_balancer.puml
!includeurl ICONURL/Servers/server_generic.puml

'==============================
' L4
'==============================

rectangle "<$load_balancer>\n===127.0.0.1\nlocalhost" <<l4>> as l4
note right of l4: ===L7 Health Check\nPort: 80\nURL: /l7check

'==============================
' Servers
'==============================

package "apis" as apis {
  rectangle "<$server_generic>\n===API1\n127.0.0.1" as api1
  rectangle "<$server_generic>\n===API2\n127.0.0.1" as api2
  rectangle "<$server_generic>\n===API3\n127.0.0.1" as api3
  api1 -[hidden]right- api2
  api2 -[hidden]right- api3
}

'==============================
' Architecture
'==============================

l4 -down- apis

center footer © CustomCompany Corp. All Rights Reserved.
@enduml
```

```
@startuml
skinparam defaultTextAlignment center
skinparam monochrome true
skinparam shadowing false

skinparam node {
  backgroundColor Transparent
  borderColor Transparent
  stereotypeFontColor Transparent
}
hide <<switch>> stereotype

skinparam node<<desc>> {
  backgroundColor Transparent
  borderColor Transparent
  stereotypeFontColor Transparent
}

hide entity
hide circle
hide fields
hide members

' left to right direction

!define ICONURL https://raw.githubusercontent.com/Roemer/plantuml-office/master/office2014
!includeurl ICONURL/Concepts/globe_internet.puml
!includeurl ICONURL/Devices/switch.puml
!includeurl ICONURL/Servers/network.puml

node "<$globe_internet>\nInternet" as internet
node "<$network>\nNetwork"

frame "Network" as network {
  node "<$switch>\nL4" as l4
  
  node desc_api [
    description...
  ]
	
  l4 .[hidden]down. desc_api
}

internet -[hidden]down- network

@enduml
```


## C4 Model

> https://c4model.com/

- https://github.com/RicardoNiepel/C4-PlantUML
  - https://github.com/adrianvlupu/C4-PlantUML
    - https://github.com/pniewiejski/C4-PlantUML


---


```
@startuml
' skinparam monochrome true
hide stereotype

skinparam component {
  BackgroundColor<<dimmed>> #F8F8F8
  BorderColor<<dimmed>> #383838
}

skinparam interface {
  BackgroundColor<<dimmed>> #F8F8F8
  BorderColor<<dimmed>> #383838
}

package "API" {
  () "**POST** /payments/:id" as post_create
  () "**POST** /payments/:id/confirm" as post_confirm
  () "**GET** /payments" as get_payments
}

package "API Gateway" {
  () "**provider**\n* provider_name" as apigw_provider

  () "**consumer**\n* consumer_id" as apigw_consumer
  () "**consumer**(1)\n* undefined" <<dimmed>> as apigw_consumer1
  () "**consumer**(2)\n* undefined" <<dimmed>> as apigw_consumer2
  () "**consumer**(3)\n* undefined" <<dimmed>> as apigw_consumer3
  
  apigw_provider -- apigw_consumer
  apigw_provider .[#383838]. apigw_consumer1
  apigw_provider .[#383838]. apigw_consumer2
  apigw_provider .[#383838]. apigw_consumer3
}

post_create -- apigw_provider: client_id
post_confirm -- apigw_provider: client_id

package "ACL" {
  () "**provider**\n* desc\n* desc" as acl_provider
  () "**consumer**\n* desc" as acl_consumer

  acl_provider -- acl_consumer
}

note right of acl_consumer
    server1
    server2
    server3
  end note

get_payments -- acl_provider

package "Applications" {  
  apigw_consumer -- [api]
  acl_consumer -- [api]
  
  apigw_consumer1 .[#383838]. [api] 
  apigw_consumer2 .[#383838]. [api]
  apigw_consumer3 .[#383838]. [api]
  
  [api] - [tcp]
}

package "external" {
  [Customer1] <<dimmed>>
  [Customer2] <<dimmed>>
  [Customer3] <<dimmed>>
  [Customer4] <<dimmed>>
  
  [api] -- [Customer]: HTTP
  [tcp] -- [Customer] : TCP
  
  [api] .[#383838]. [Customer1]: HTTP
  [api] .[#383838]. [Customer2]: HTTP
  [tcp] .[#383838]. [Customer3] : TCP
  [tcp] .[#383838]. [Customer4] : TCP
}

@enduml
```
