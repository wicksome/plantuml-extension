> https://gist.github.com/QuantumGhost/0955a45383a0b6c0bc24f9654b3cb561

```
@startuml
' uncomment the line below if you're using computer with a retina display
' skinparam dpi 300
!define Table(name,desc) class name as "desc" << (T,#FFAAAA) >>
' we use bold for primary key
' green color for unique
' and underscore for not_null
!define primary_key(x) <b>x</b>
!define unique(x) <color:green>x</color>
!define not_null(x) <u>x</u>
' other tags available:
' <i></i>
' <back:COLOR></color>, where color is a color name or html color code
' (#FFAACC)
' see: http://plantuml.com/classes.html#More
hide methods
hide stereotypes

' entities

Table(user, "user\n(User in our system)") {
primary_key(id) INTEGER
not_null(unique(username)) VARCHAR[32]
not_null(password) VARCHAR[64]
}

Table(session, "session\n(session for user)") {
primary_key(id) INTEGER
not_null(user_id) INTEGER
not_null(unique(session_id)) VARCHAR[64]
}

Table(user_profile, "user_profile\n(Some info of user)") {
primary_key(user_id) INTEGER
age SMALLINT
gender SMALLINT
birthday DATETIME
}

Table(group, "group\n(group of users)") {
primary_key(id) INTEGER
not_null(name) VARCHAR[32]
}

Table(user_group, "user_group\n(relationship of user and group)") {
primary_key(user_id) INTEGER
primary_key(group_id) INTEGER
joined_at DATETIME
}

' relationships
' one-to-one relationship
user -- user_profile : "A user only \nhas one profile"
' one to may relationship
user --> session : "A user may have\n many sessions"
' many to many relationship
' Add mark if you like
user "1" --> "*" user_group : "A user may be \nin many groups"
group "1" --> "0..N" user_group : "A group may \ncontain many users"
@enduml
```
