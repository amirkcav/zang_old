ZANGDEMO ; Demo routine for the MUMPS Angular web interface
         ; PROGRAMMER: URI
         ; CREATED ON: 14.09.17 16:53 BY: ECLIPSE MDE
         ; AT: CAV SYSTEMS, CACHE SERVER UCI: USER FROM: uripc.cav.local
         ; ------------------------------------------------------------------
         Q
FORM     ; Generate form structure, in JSON
         N J,I
         N KEY S KEY=$G(%JSON("FORM"))
         S I=0
         I (KEY="A")!(KEY="C") D
         . S I=I+1
         . S J(I,"class")="TextboxQuestion"
         . S J(I,"key")="emailAddress"
         . S J(I,"label")="Email Address"
         . S J(I,"type")="email"
         . S J(I,"order")="2"
         . S J(I,"value")="me1@example.com"
         . ;S J(I,"value")=""
         . ;S J(I,"readonly")="true"
         .
         . S I=I+1
         . S J(I,"class")="TextboxQuestion"
         . S J(I,"key")="name"
         . S J(I,"label")="Name. Can't contain 'XXX'. If it has a space character, the email address is set"
         . S J(I,"order")="1"
         . S J(I,"value")="John Doe"
         .
         . S I=I+1
         . S J(I,"class")="TextboxQuestion"
         . S J(I,"key")="age"
         . S J(I,"label")="Age"
         . S J(I,"order")="3"
         . S J(I,"type")="number"
         . S J(I,"value")="33"
         .
         . S I=I+1
         . S J(I,"class")="TextboxQuestion"
         . S J(I,"key")="actualAge"
         . S J(I,"label")="Actual age (invisible)"
         . S J(I,"order")="3"
         . S J(I,"type")="number"
         . S J(I,"value")="33"
         . S J(I,"visible")="false"
         I KEY="B" D
         . H 2
         . S J(1,"class")="DropdownQuestion"
         . S J(1,"key")="title"
         . S J(1,"label")="Title"
         . S J(1,"order")="1"
         . S J(1,"options",1,"key")="mr"
         . S J(1,"options",1,"value")="Mr."
         . S J(1,"options",2,"key")="mrs"
         . S J(1,"options",2,"value")="Mrs."
         . S J(1,"options",3,"key")="ms"
         . S J(1,"options",3,"value")="Ms."
         . S J(2,"class")="TextboxQuestion"
         . S J(2,"key")="dob"
         . S J(2,"type")="date"
         . S J(2,"label")="Date of Birth"
         . S J(2,"order")="2"
         . S J(2,"value")="2000-01-02"
         . S J(3,"class")="TextboxQuestion"
         . S J(3,"key")="emailAddress"
         . S J(3,"label")="Email Address"
         . S J(3,"type")="email"
         . S J(3,"readonly")="true"
         . S J(3,"order")="3"
         . ;S J(3,"value")="readonly@example.com"
         . S J(3,"value")=""
         . ;F I=3:1:8 D
         .. S J(I,"class")="TextboxQuestion"
         .. S J(I,"key")="dob"_I
         .. S J(I,"type")="date"
         .. S J(I,"label")="Date of Birth"
         .. S J(I,"order")="2"
         .. S J(I,"value")="2000-01-02"
         . 
         D RESPONSE(.J,"ok")
         Q
VALIDATE ; validate a single form field. If valid, optionally 
         ; return values to set in other form fields
         N J
         N KEY S KEY=$G(%JSON("FORM"))
         N FIELD S FIELD=$G(%JSON("FIELD"))
         N VALUE S VALUE=$G(%JSON("VALUE"))
         
         I ((KEY="A")!(KEY="C")),FIELD="name",VALUE["XXX" D  Q
         . S J("status")="error"
         . S J("message")="Name can't contain ""XXX"""
         . D RESPONSE(.J,"ok")
         S J("status")="ok"
         I ((KEY="A")!(KEY="C")),FIELD="name",VALUE[" " D
         . S J("values","emailAddress")=$P(VALUE," ",1)_"."_$P(VALUE," ",2)_"@gmail.com"
         . ;S J("values","name")=VALUE_" Kazabubu"
         I (KEY="B") D
         . S J("values","emailAddress")=""
         D RESPONSE(.J,"ok")
         Q
SAVE     ; saves a form, and returns whether ok or not.
         N J
         N KEY S KEY=$G(%JSON("FORM"))
         N PARAMS S PARAMS=$G(%JSON("PARAMS"))
         N VALUES M VALUES=%JSON("VALUES")
          M ^W("URI","SAVE",KEY)=VALUES
         I (KEY="A") D
         . S J("status")="ok"
         . M J("values")=VALUES
         I (KEY'="A") D
         . S J("status")="error"
         . S J("message")="Error saving, for demo purposes"
         . M J("values")=VALUES
         D RESPONSE(.J,"ok")
         Q
RESPONSE(DATA,STATUS,MESSAGE) ; WRITE THE JSON BACK TO THE CLIENT
         N RES,A
         ;
         S RES("status")=STATUS
         S RES("message")=$G(MESSAGE)  ; ERROR
         M RES("data")=DATA
         ;
         S A=$$M2J^%ZCAVJSON("RES")
         Q
         ;
AUTH(USER,PASS,LABEL) ;
         D INIT
         M ^W("URI")=%ARG
         S ^W("URI","USER")=$G(USER)
         S ^W("URI","PASS")=$G(PASS)
         ;
         I $D(%ARG("JB")) S JB=%ARG("JB") ; To allow debugging from Fiddler and alike
         Q:$D(^W($G(JB,"xxx"),"USER")) 1 ; Job (session) already authenticated
         Q:'$D(JB) 0 ; No job (session)
         Q:'$D(USER) 0 ; No username
         Q:'$D(PASS) 0 ; No PASSWORD
         Q:USER'=PASS 0 ; For testing - authenticated if username equals to password
         S ^W(JB,"USER")=USER
         Q 1
JOB()    ;
         N JB,I
         ;
         S JB=""
         ZA ^WJOB
         ;
         F I=1:1:3 D  Q:JB  H 1
         . S JB=$TR($H,",")
         .I $D(^W(JB)) S JB="" Q
         . S ^W(JB)=$$USER^%ZCAVV
         ;
         ZD ^WJOB
         ;
         Q JB
INIT     ;
         S D="_",C=":"
         Q

