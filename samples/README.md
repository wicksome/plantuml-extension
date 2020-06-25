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
!includeurl ICONURL/Servers/server_generic.puml
!includeurl ICONURL/Devices/switch.puml
!includeurl ICONURL/Servers/network.puml
!includeurl ICONURL/Devices/router.puml

node "<$globe_internet>\nInternet" as internet
node "<$network>\nNetwork"

frame "Network" as network {
  frame "DMZ" as dmz {
    node "<$switch>\nL4" as l41
  }
  frame "Private" as pri {
    node "<$switch>\nL4" as l42
  }
  
  node desc_api [
    description...
  ]
	
	pri .[hidden]down. desc_api
  dmz .[hidden]down. desc_api
}

internet -[hidden]down- network

@enduml
```
