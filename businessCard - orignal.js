var contextDR, webDR, usr,author;var organisationValue;
var check = "none";var ChineseDesignation;
var BuisnessCard = React.createClass({
    getInitialState() {
        return {
		Title: '',
		StaffName: '',
		//Designation:'',
		Organisation: '',
		OrganisationData:[],
		Division:"Please Select",
		divisonData:[],
		departmentData:[],
		Address : "",
		//Email:"",
		//DirectNumber:"",
		//Mobile:"",
		//Fax:"Only for Legal",
		ChineseCard: "",
		ChineseName: "",
		ChineseDesignationData:[],
		ChineseDivisionData:[],
		ChineseDesignation: "",
		ChineseDivision: "",
		FileUpload: '',
		errors: [],
		Department:"Please Select",
		ischecked: false,
		isSelected: false,
		isValid: false,
		self :"table-row",
		onBehalfof:"none",
		images:[],
		selectedImage:[],
		peoplePickerDiv:'',
		Boxes:"Please Select",
		Background: "Please Select",
		data: [],SelectCard:"none",FrontImages:[]                      

	}
		this.handleChange = this.handleChange.bind(this)
		this.handleImages= this.handleImages.bind(this)
		this.PeoplePickerUsers = this.PeoplePickerUsers.bind(this)
		this.handlePeople = this.handlePeople.bind(this)
		this.selectImage=this.selectImage.bind(this)
		this.handleBoxes= this.handleBoxes.bind(this)
        this.updateData = this.updateData.bind(this)
        this.deleteData = this.deleteData.bind(this)
		this.handleChanges = this.handleChanges.bind(this)
		this.populateChineseDesignation=this.populateChineseDesignation.bind(this) 
		this.populateChineseDivision=this.populateChineseDivision.bind(this)
			},
	componentWillMount() {
		this.getOrganisation();
	},
	getUserData(){
	var authorLogin;
        $.ajax({
            url: "/bcs/_api/web/CurrentUser",
            type: "GET",
            headers: { "Accept": "application/json; odata=verbose", "X-RequestDigest": $("#__REQUESTDIGEST").val() },
            dataType: "json",
            async: true,
            cache: false,
            success: function (data) {
                author=data.d.Title
                authorLogin = data.d.LoginName; 
                console.log("Author Login Name: " + authorLogin)
                }              
     });
	    $.ajax({
            type: "GET",
            dataType: "json",
            cache: false,
            url: '/bcs/Pages/BCS_GetUserDetails.aspx',
            success: function (response) {
                this.setState({    
                    Fax: response.FaxNumber,
                    Designation : response.Designation,
                    Email: response.EmailAddress,
                    DirectNumber: response.DirectLine,
                    Department: response.Department,
                    Mobile: response.MobileNumber,
                    Division:response.Division,
                    //Title: authorLogin.substring(authorLogin.lastIndexOf("\\")+1),
                    StaffName: author,
                    Title: response.StaffName
                })
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        });
	},
	getFrontImage(){
		$.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetFrontImage.aspx?organisation='+ organisationValue,
            success: function (response) {
            var frontimg= _.orderBy(response, ['Title'], ['desc']);
                this.setState({
                    FrontImages : frontimg            })
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        });     
	},
	getDivision(){
		$.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetDivision.aspx',
            success: function (response) {
            console.log(response)
                this.setState({
                    divisonData: response})
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        }); 
	},
	getDepartment(){
		$.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetDepartment.aspx',
            success: function (response) {
            console.log(response)
                this.setState({departmentData: response})
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        }); 
	},
	getAddress(){
	    $.ajax({
            type: "GET",
            dataType: "json",
            async:false,
            url: '/bcs/Pages/BCS_GetAddress.aspx?organisation='+ organisationValue,
            success: function (response) {
                this.setState({
                    Address : response.Address,Telephone: response.Telephone})
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        });     
	},
	getChineseDesignation(){
	    $.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetChineseDesignation.aspx',
            success: function (response) {
                this.setState({
                    ChineseDesignationData: response})
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        });     
	},
	getChineseDivision(){
	    $.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetChineseDivision.aspx',
            success: function (response) {
                this.setState({
                    ChineseDivisionData: response})
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        });     
	},
	getOrganisation(){
	    $.ajax({
            type: "GET",
            dataType: "json",
            async:false,
            url: '/bcs/Pages/BCS_GetOrganisation.aspx',
            success: function (response) {
                organisationValue=response[0].Organisation;
                this.setState({
                    OrganisationData: response,Organisation:response[0].Organisation})
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
        });     
	},



    validation() {
        var errors = [];
       // var word=/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
       var word=/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;
        if (this.state.Title.length == 0) {
        	this.setState({errPrintedCard : 'Please enter name to be printed on card'})
            errors.push("Please enter name to be printed on card");
        }
        else{
        	this.setState({errPrintedCard : ''})
        }
        if (this.state.StaffName.length == 0) {
            this.setState({errStaff:"Please enter staff name"})
            errors.push("Please enter staff name");
        }
        else{
        	this.setState({errStaff:""})
        }
        if(this.state.isSelected ==='OnBehalfOf'){
             if (this.state.peoplePickerDiv.length == '' || peoplePicker.GetAllUserInfo().length<1 ) {
                this.setState({peoplePickerDiv:'',errpeoplePickerDiv:"Please enter staff name"})
                errors.push("Please enter staff name");         
                    }
            else{
                    this.setState({errpeoplePickerDiv:""})
                }
        }
        if (this.state.Designation.length == '') {
        	this.setState({errDesignation : 'Please enter designation'})
            errors.push("Please enter designation");
        }
        else{
        	this.setState({errDesignation:""})
        }
        if (this.state.Division == "Please Select") {
        	this.setState({errDivision : 'Please select division'})
            errors.push("Please select division");
        }
        else{
        	this.setState({errDivision:""})
        }
        if (this.state.Address.length == '') {
        	this.setState({errAddress: 'Please enter address'})
            errors.push("Please enter address");
        }
        else{
        	this.setState({errAddress:""})
        }
        if (this.state.Email.length == '') {
        	this.setState({errEmail: 'Please enter email address'})
            errors.push("Please enter email address");
        }
        else{
        	this.setState({errEmail:""})
        }
        if(this.state.Email){
        	if (word.test(this.state.Email) === false)
        	{
         	  this.setState({errValidEmail: 'Please enter valid email address'})
           	  errors.push("Please enter valid email address")                   
        	} 
        	else{
        		this.setState({errValidEmail:""})
        	    }
        }       
        if (this.state.DirectNumber == '') {
        	this.setState({errValidDirect: 'Please enter direct number'})
            errors.push("Please enter direct number");
        }
        else{
        	this.setState({errValidDirect: ''})
        }
        if(this.state.DirectNumber){
        if (isNaN(this.state.DirectNumber) || this.state.DirectNumber.length>8 || this.state.DirectNumber.length<8) {
           this.setState({errValidDirect: 'Please enter valid direct number'})
           errors.push("Please enter valid direct number");
        }
        else{
        	this.setState({errValidDirect: ''})
        }
        }
        if (this.state.Department== 'Please Select') {
        	this.setState({errDepartment: 'Please select department'})
            errors.push("Please select department");
        }
        else{
        	this.setState({errDepartment : ''})
        }
        if(this.state.Mobile){
        if(isNaN(this.state.Mobile) || this.state.Mobile.length>8 || this.state.Mobile.length<8){
           this.setState({errValidMobile: 'Please enter valid mobile number'})
           errors.push("Please enter valid mobile number");           
        }
        else{
        	this.setState({errValidMobile: ''})
        }}
        else{this.setState({errValidMobile: ''})}
        
        if (this.state.Fax == '' && this.state.Organisation == "PDPC" ) {
        	this.setState({errValidFax: 'Please enter Fax number'})
            errors.push("Please enter Fax number");
        }
        else{            
        	this.setState({errValidFax: ''})
        }        
        if(this.state.Fax){
        if (isNaN(this.state.Fax) || this.state.Fax.length>8 || this.state.Fax.length<8 ) {
           this.setState({errValidFax: 'Please enter valid fax number'})
           errors.push("Please enter valid fax number");
        }
        else{
        	this.setState({errValidFax: ''})
        }}
        else{this.setState({errValidFax: ''})}
        if (this.state.images.length>0 && this.state.data == '') {
        	 this.setState({errBackImage: 'Please select choose card template,no of boxes and back card design'})
            errors.push("Please select choose card template,no of boxes and back card design");
        }
        else{
        	this.setState({errBackImage: ''})
        }
        /*validation checking for chineseName*/
        if(this.state.ischecked){
        	if(this.state.ChineseName==''){
        	 this.setState({errChineseName: 'Please enter chinese name'})
        	  errors.push("Please enter chinese name");
        	}
        	else{
        		this.setState({errChineseName: ''})
        	}
        	if(this.state.ChineseDesignation==''){
        		this.setState({errChineseDesignation: 'Please enter chinese designation'})
        		 errors.push("Please enter chinese designation");
        	}
        	else{
        		this.setState({errChineseDesignation: ''})
        	}
	        // if(this.state.ChineseDivision){
	        // if (this.state.ChineseDivision.length == '') {
	        //     this.setState({errChineseDivision: ''})
	        // }
			// }

        	//if(this.state.ChineseDivision==''){
        	//	this.setState({errChineseDivision: 'Please enter chinese division'})
        	//	errors.push("Please enter chinese division");
        	//}
        	//else{
        	//	this.setState({errChineseDivision: ''})
        	//}
        }
        else{
        	this.setState({errChineseDivision: '',errChineseDesignation: '',errChineseName: ''})
        }
        if (errors.length > 0) {
            this.setState({ errors });
        } else {
            this.setState({
                isValid: true
            })
        }
    },
     selectImage(idx,title,e){   	
    	if(e.target.checked){
                var imageUrl= idx;
                var title=title;
                console.log(title)
    			this.setState({ selectedImage : imageUrl ,selectedImageTitle:title }, () => { console.log(this.state.selectedImageTitle) })
    	}
    	else{
    		this.setState({ selectedImage : ""}, () => { console.log(this.state.selectedImage) })
    	}    	
  		$('.pinkcheckbox').on('change', function() {
		    $('.pinkcheckbox').not(this).prop('checked', false);  
		});  
    	this.setState({checked: e.target.checked})
		},
	handleImages(e) {
		$('.pinkcheckbox').prop('checked', false);
        this.setState({selectedImage :""})      
    }, 
	handleBoxes(e) {
        this.setState({ Boxes: e.target.value })
    },  
    handleChanges(e) {
        this.setState({ Background: e.target.value })
    }, 	
    handleBackground(e) {
        this.setState({ Background: "Please Select" })
    }, 
    handleBox(e) {
        this.setState({ Boxes: "Please Select" })
    }, 
    checking() {
    	this.setState({ ischecked: !this.state.ischecked  },function(){   
    	if(this.state.ischecked){
   	 		this.populateChineseDesignation();
    		this.populateChineseDivision();
    		check = "table-row";
    	}else{
    		check = "none" ;
    		this.setState({ChineseDesignation:'',ChineseDivision:''})
    	}  
    	})                  
    },   
    cancel() {
          console.log("cancel");
          window.location.href=_spPageContextInfo.webAbsoluteUrl;
      },
    submit(e) {
        console.log('submitting')
        e.preventDefault();
        this.validation();
        var that=this;
        var ValidMobile=isNaN(that.state.Mobile);
        var ValidDirect=isNaN(that.state.DirectNumber);
		var ValidFax=isNaN(that.state.Fax);
        if(that.state.Email){
           	  //let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
           	  var reg= /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
              if(reg.test(that.state.Email) === false)
				  {
					 return false;
				  }	
          	 	}
        if(ValidDirect|| that.state.DirectNumber.length >8 || that.state.DirectNumber.length <8){
        		return false;
        } 
			if(that.state.Mobile){
                if(ValidMobile || that.state.Mobile.length<8 || that.state.Mobile.length>8){
                return false;
                }}
        	if(that.state.Fax){
                if(ValidFax || that.state.Fax.length<8 || that.state.Fax.length>8){
                return false;
                }}
        if(that.state.ischecked){
        	if(that.state.ChineseName ==''|| that.state.ChineseDesignation ==''){
        	return false;
        	}
        }	
        return that.state.data.map(function(item){
        console.log(item)
        if (that.state.isSelected =="Self" && that.state.Title !='' && that.state.StaffName != "" && that.state.Designation != '' && that.state.Division != "Please Select" && that.state.Department!="Please Select" && that.state.Address != '' && that.state.Email != '' && that.state.DirectNumber != '' && that.state.data != '' && ValidMobile == false && ValidDirect == false && ValidFax == false || that.state.isSelected =="OnBehalfOf" && that.state.Title !='' && that.state.peoplePickerDiv != "" && that.state.Designation != '' && that.state.Department!="Please Select"  && that.state.Division != "Please Select" && that.state.Address != '' && that.state.Email != '' && that.state.DirectNumber != '' && that.state.data != '' && ValidMobile == false && ValidDirect == false && ValidFax == false) {
            const data = new FormData();
            data.append('title', that.state.Title);
            data.append('toWhome', that.state.isSelected);
            var accname = encodeURIComponent(that.PeoplePickerUsers());
            if(that.state.isSelected == 'Self'){
            data.append('staffName', that.state.StaffName);
            }
            else{
            data.append('staffName', accname);
          	}
            
            data.append('designation', that.state.Designation);
            data.append('division', that.state.Division);
            data.append('department', that.state.Department);
            data.append('address', that.state.Address);
            data.append('email', that.state.Email);
            data.append('dNumber', that.state.DirectNumber);
            data.append('mobile', that.state.Mobile);
            data.append('fax', that.state.Fax);
            data.append('cBacking', that.state.ChineseCard);
            data.append('cName', that.state.ChineseName);
            data.append('cDesignation', that.state.ChineseDesignation);
            data.append('cDivision', that.state.ChineseDivision);
            data.append('organisation', item.organisation);
            data.append('boxes',item.boxes);
            data.append('background',item.background);
            data.append('backDesignImage',item.selectedImage);
            data.append('telephone',item.telephone);
            data.append('backTitle',item.selectedImageTitle)
            if(item.ischecked){
            data.append('includeChinese','Yes');
            }
            else{
            data.append('includeChinese','No');
            }
            data.append('Author',author)
            try {
              var file= document.getElementById("fileToUpload").files[0]
               data.append('fileName',file.name);
               data.append('fileSize',file);    
              }
				catch(err) {
				    
				}
          var url='/bcs/Pages/SendBusinessRequest.aspx'
          
          fetch(url, {
            method: 'POST',
            body: data,credentials:'include'
               }).then(function(){
                swal({
                    title: "Request successfully submitted", 
                    text: "Request will be routed to the printer for printing", 
                    type: "success"}).then(function () {
                       window.location.href=_spPageContextInfo.webAbsoluteUrl;
                    });
               })
            // var request = new XMLHttpRequest();
			// 	request.open("POST", url);
			// 	request.send(data);
                
           }
        }.bind(this));
        },
        handleUserInput(e) {
        this.setState({ [e.target.name]: e.target.value });
        if(this.state.ischecked && e.target.name == 'Designation'){
        this.setState({ [e.target.name]: e.target.value },function () {
               	 		this.populateChineseDesignation();
    					this.populateChineseDivision();
        })
        }
    },
    bindErrors() {
        return this.state.errors.map((data) => (<Error item={data} />));
	},
	handleChange(e) {
	var self=this;
	e.persist();
        var inputValue = e.target.value;
        if(this.state.Organisation != "PDPC" ) {   this.setState({Fax: ''})  }     
        if(inputValue != "IMDA" ) {   self.setState({ischecked: false});check = "none" ;  } 
	    swal({
            title: "Please note that the details that you had entered will be reflected for all name cards", 
            text: "", 
            type: "success"}).then(function () {
        $.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetBackDesign.aspx?organisation=' + inputValue,
            success: function (response) {
                self.setState({
                    images: response            })
            }.bind(self),
            error: function (err) {
                console.error(err);
            }.bind(self)
    });
        $.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetFrontImage.aspx?organisation=' + inputValue,
            success: function (response) {
                self.setState({            
                    FrontImages: response            })
            }.bind(self),
            error: function (err) {
                console.error(err);
            }.bind(self)
    });  
        $.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetAddress.aspx?organisation=' + inputValue,
            success: function (response) {
                if(response.Address != null){
                self.setState({
                    Address : response.Address,Telephone: response.Telephone })
                    }
                    else{
                    self.setState({
                    Address : "",Telephone:'' })
                    }
            }.bind(self),
            error: function (err) {
                console.error(err);
            }.bind(self)
    });
        self.setState({ Organisation: inputValue,selectedImage :""},function(){
    	console.log(inputValue)
    	 if(self.state.ischecked){
   	 		self.populateChineseDesignation();
    		self.populateChineseDivision(); 
    	} 
    })
    $('.pinkcheckbox').prop('checked', false); 
    });
    },
	getTemplate(){
    	return this.state.FrontImages.map((dataitem,idx)=><option>{dataitem.Title}</option>)
	},
    handleDivision(e) { 
        var that = this;   
        that.setState({ Division: e.target.value},function () {
                if(this.state.ischecked){
                this.populateChineseDesignation();
                this.populateChineseDivision();
                }     			 
            })           
    },
    getusername() {
        contextDR = new SP.ClientContext.get_current();
        webDR = contextDR.get_web();
        usr = webDR.get_currentUser();
        contextDR.load(usr);
        contextDR.executeQueryAsync(Function.createDelegate(this, function () { this.usrsuccess(); }), Function.createDelegate(this, function () { this.usrfail(); }));
    },
    usrsuccess(sender, args) {
        var a = usr.get_title() + ";";
        console.log(a)
        var peoplePickerteamleaderDiv = SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;
        // peoplePickerteamleaderDiv.AddUserKeys(a);
    },
    usrfail(sender, args) {
    },
    PeoplePickerUsers() {
        // Get the people picker object from the page.
        var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;
        // Get information about all users.
        var users = peoplePicker.GetAllUserInfo();
        var userInfo = '';
        for (var i = 0; i < users.length; i++) {
            var user = users[i];
            userInfo += user.Description + ';';
        }
        return userInfo.substring(0, userInfo.length - 1);
    },
    initializePeoplePicker(peoplePickerElementId) {
        console.log("111111")
        // Create a schema to store picker properties, and set the properties. 
        var schema = {};
        schema['PrincipalAccountType'] = 'User,DL,SecGroup,SPGroup';
        //This value specifies where you would want to search for the valid values
        schema['SearchPrincipalSource'] = 15;
        //This value specifies where you would want to resolve for the valid values
        schema['ResolvePrincipalSource'] = 15;
        schema['AllowMultipleValues'] = false;
        schema['MaximumEntitySuggestions'] = 50;
        schema['Width'] = '280px';
        // Render and initialize the picker. 
        // Pass the ID of the DOM element that contains the picker, an array of initial  
        // PickerEntity objects to set the picker value, and a schema that defines 
        // picker properties.             
        SPClientPeoplePicker_InitStandaloneControlWrapper(peoplePickerElementId, null, schema);

    },
    changeNameCard(){
        $('#namecard').find('h1').text('Business Card');
        $('#namecard').find('h2').text('System');   
    },
    componentDidMount(e) {
        this.initializePeoplePicker('peoplePickerDiv');
        this.getusername();
        this.changeNameCard();
        this.getUserData();
        this.getFrontImage();
        this.getAddress();
        this.getDivision();
        this.getChineseDesignation();
        this.getChineseDivision();
        this.getDepartment();
	
         $.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetBackDesign.aspx?organisation=' + organisationValue,
            success: function (response) {
                this.setState({
                    images: response            })
            }.bind(this),
            error: function (err) {
                console.error(err);
            }.bind(this)
    });     
            this.setState({   isSelected: "Self"  })
       
    },   
    componentDidUpdate(){
        var that=this;
        SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan.OnValueChangedClientScript=function (peoplePickerId, selectedUsersInfo){
        if(selectedUsersInfo.length !=0 && selectedUsersInfo[0].Key)
        {console.log(selectedUsersInfo[0].Key);
        console.log(selectedUsersInfo[0].DisplayText);
            //var selectedUser=selectedUsersInfo[0].Key.replace('i:0#.w|','')
            //var selectedUser=selectedUsersInfo[0].DisplayText
            var selectedUser=selectedUsersInfo[0].Key
            selectedUser=selectedUser.substring(selectedUser.lastIndexOf("\\")+1)
            console.log("Test!!!" + selectedUser)
            that.setState({
            peoplePickerDiv:selectedUsersInfo[0].DisplayText
            })
		$.ajax({
            type: "GET",
            dataType: "json",
            url: '/bcs/Pages/BCS_GetUserDetails.aspx?LANID=' + selectedUser,
            success: function (response) {
                    that.setState({    
                    Fax: response.FaxNumber,
                    Designation : response.Designation,
                    Email: response.EmailAddress,
                    DirectNumber: response.DirectLine,
                    Department: response.Department,
                    Division: response.Division,
                    Mobile: response.MobileNumber,
                    Title: response.StaffName,
                })
            }.bind(that),
            error: function (err) {
                console.error(err);
            }.bind(that)
        });
		}
	}
    },
    restrictsouser(e){
        var peoplePicker = SPClientPeoplePicker.SPClientPeoplePickerDict.peoplePickerDiv_TopSpan;
		console.log("from restrictuser");
		var users = peoplePicker.GetAllUserInfo();
		console.log(users.length);
		console.log("key "+e.keyCode);
		var num =  users.length
		if(num > 0 ){
        	e.preventDefault();
        		//if (e.keyCode === 8) 
        		//	console.log("i am backspace");
        			//e.preventDefault(); 
			}
		if(e.keyCode === 8){
				//e.preventDefault();				
			this.setState({
			peoplePickerDiv:''
				})
			return false;
				//console.log("backspace");
			}
       },

    setRadio(e) {
    	var that=this;
    	var inputValue=e.target.value
        console.log("insideRadio- " + inputValue); 
        swal({
       		title: "Please note that the details that you had entered will be reflected for all name cards", 
            text: "", 
            type: "success"}).then(function () {
           	 if(inputValue ==='Self')
        	{       
            console.log("self- " + inputValue);
            that.setState({  self : "table-row",onBehalfof: "none"})
            that.getUserData();
        	}
       		 if(inputValue ==='OnBehalfOf'){
       		that.getAddress();
            console.log("onBehalfof- " + inputValue);
            that.setState({  self : "none",onBehalfof: "table-row",Designation:"",Title:"",Email:"",Division:"Please Select",Department:"Please Select",DirectNumber:'',Mobile:"",Fax:"",Boxes:"Please Select",Background:"Please Select",selectedImage:"",Organisation:"IMDA",ChineseDivision:'',ChineseDesignation:'',ChineseName:''})
            $('.pinkcheckbox').prop('checked', false);
        }  
                    }); 
        this.setState({  isSelected: inputValue    });
    },
        updateData(e) {      
            var data = this.state.data;
            var images=this.state.images;
            var boxes = this.state.Boxes;
            var background = this.state.Background;
            var telephone=this.state.Telephone;
            var selectedImage=this.state.selectedImage;
            var selectedImageTitle=this.state.selectedImageTitle;
            var organisation=this.state.Organisation;
            var ischecked=this.state.ischecked;
            if(images.length == 0 && boxes !="Please Select" && background != "Please Select"){
                data.push({"boxes": boxes,  "background":background , "selectedImage" :selectedImage ,'telephone':telephone,'organisation':organisation,'ischecked':ischecked,'selectedImageTitle':selectedImageTitle})               
                console.log(data); 
                this.handleBackground();
                this.handleBox();   
                this.setState({ data ,SelectCard : "none" }, () => { console.log(data) })
                }
                else{
                if(boxes !="Please Select" && background != "Please Select" && selectedImage != "" ){
                data.push({"boxes": boxes,  "background":background , "selectedImage" :selectedImage, 'telephone':telephone,'organisation':organisation,'ischecked':ischecked,'selectedImageTitle':selectedImageTitle})               
                console.log(boxes);  
                this.handleBackground();
                this.handleBox();   
                this.setState({ data ,SelectCard : "none" }, () => { console.log(data) })
                }
                else{this.setState ({ SelectCard : "inline" }) }       
                }
   		},

     deleteData(index) {
        console.log(index)
        var data = this.state.data;
        data.splice(index, 1)
        this.setState({ data  })
    },
    renderDivision(){
    var orderDivision=_.orderBy(this.state.divisonData, ['Name'], ['asc']);
    	return orderDivision.map((item,idx)=><option>{item.Name}</option>)
    },
    populateChineseDesignation(){
        var that=this;
        var sortedDesignation=_.filter(that.state.ChineseDesignationData , {EnglishText: that.state.Designation})
        console.log(sortedDesignation)
        if(sortedDesignation.length >= 1){
        return sortedDesignation.map(function(item,idx){
            ChineseDesignation=item.ChineseTranslation;
            console.log(ChineseDesignation)
            that.setState({ChineseDesignation})	
	})}
	else{
	    that.setState({ChineseDesignation:''})
	}
	},
	populateChineseDivision(){
        var that=this;
        var sortedDivision=_.filter(that.state.ChineseDivisionData , {EnglishText: that.state.Division})
        console.log(sortedDivision.length)
        if(sortedDivision.length >= 1){
        return sortedDivision.map(function(item,idx){
            var ChineseDivision=item.ChineseTranslation;
            console.log(ChineseDivision)
            that.setState({ChineseDivision})	
        })}
        else{
        that.setState({ChineseDivision:''})
        }
	},
	renderOrganisation(){
		return this.state.OrganisationData.map((item,idx)=><option>{item.Organisation}</option>)
	},
	renderDepartment(){
           var orderDepartment=_.orderBy(this.state.departmentData, ['Name'], ['asc']);
            return orderDepartment.map((item,idx)=><option>{item.Name}</option>)
	},
	handleDepartment(e){
		this.setState({Department:e.target.value})
	},
   render() {
        return (<table className="body_block">   			
    <tr>
        <td className="content_side">
        <span className="red size" style={{fontSize:18+'px'}}>Please note that after your request for business name card is submitted, you will receive an email from the name card vendor to confirm the final artwork. After this is confirmed, it will take 2 working weeks for you to receive the business name card.</span>
            <table className="section_table" id="section_personal_en">
                <tr>
                    <td>
                        <table className="body_titles">
                            <tr>
                                <td className="title_list_text">
                                    <h4>Personal Particulars</h4>
                                    <h5>For English Namecard</h5>
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
                <tr>
                    <td>
                        <table className="form_block">
                            <tr className="field_row">
                                <td className="label_cell">

                                </td>
                                <td className="field_cell">
                                    <div onChange={this.setRadio}>
                                        <input type="radio" value="Self" name="gender" onClick={this.setRadio} checked={this.state.isSelected==='Self' } /> Self
                                        <input type="radio" value="OnBehalfOf" name="gender" onClick={this.setRadio} checked={this.state.isSelected==='OnBehalfOf' } /> On Behalf Of
                                    </div>
                                    {/* this.state.isSelected==='OnBehalfOf' ? (<div className='red' style={{marginTop: 10+ 'px',marginBottom: -10+ 'px'}}>Details are retrieving from Central Service,if the details are incorrect,please contact Siong Chai at Tan_Siong_Chai@imda.gov.sg</div>):(<div></div>) */}
                                </td>
                            </tr>
                            <tr className="field_row" style={{display: this.state.onBehalfof}}>
                                <td className="label_cell"> Name of Staff <span className="red">* </span><b>:</b></td>
                                <td className="field_cell">
                                    <div id="peoplePickerDiv" name="peoplePickerDiv" value={this.state.peoplePickerDiv} onKeyDown={this.restrictsouser}></div>
                                    <span className='red'>{this.state.errpeoplePickerDiv}</span>
                                </td>
                            </tr>
                            <tr className="field_row" style={{display: this.state.self }}>
                                <td className="label_cell"> Name of Staff <span className="red">* </span><b>:</b></td>
                                <td className="field_cell">
                                    <input type="text" id="StaffName" name="StaffName" value={this.state.StaffName} onChange={this.handleUserInput} disabled />
                                    <span className='red'>{this.state.errStaff}</span>
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Organisation <span className="red">* </span><b>:</b></td>
                                <td className="field_cell">
                                    <select className="form-control" id="organisation" name="organisation" value={this.state.Organisation} onChange={this.handleChange}>
                                    				{this.renderOrganisation()}
                                    </select>
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Name to be printed on card <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">
                                    <input type="text" id="title" name="Title" maxLength="66" value={this.state.Title} onChange={this.handleUserInput} />
                                    <span className='red'>{this.state.errPrintedCard}</span>
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Designation <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">
                                    <input type="text" id="designation" name="Designation" value={this.state.Designation} onChange={this.handleUserInput} disabled />
                                    <span className='red'>{this.state.errDesignation}</span>
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Department <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">
                                 <select className="form-control" id="department" name="Department" value={this.state.Department} onChange={this.handleDepartment.bind(this)}>
                                       <option>Please Select</option>
	                               			{this.renderDepartment()}
	                               	   <option disabled>───────────────────────</option>
	                               	   <option>Do Not Display</option>
	                               	</select>
                                    <span className='red'>{this.state.errDepartment}</span>
								 </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Division <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">
                                    <select className="form-control" id="division" name="Division" value={this.state.Division} onChange={this.handleDivision.bind(this)}>
                                       <option>Please Select</option>
                                       {this.renderDivision()}
                                       <option disabled>───────────────────────</option>
	                               	   <option>Do Not Display</option>
                                    </select>
                                    <span className='red'>{this.state.errDivision}</span>
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Address <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">
                                    <textarea rows="4" cols="100" id="address" name="Address" value={this.state.Address} onChange={this.handleUserInput}></textarea>
                                    <span className='red'>{this.state.errAddress}</span>
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Email <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">
                                    <input type="email" id="email" name="Email" value={this.state.Email} onChange={this.handleUserInput} />
                                    <span className='red'>{this.state.errEmail}</span>
                                    <span className='red'>{this.state.errValidEmail}</span>
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>
            <table className="section_table" id="section_personal_ch">
                <tr>
                    <td>
                   <table className="form_block" style={{display : this.state.Organisation == "IMDA" ? "block" : "none"}}>
                            <tr className="field_row">
                                <td className="field_cell field_cell_pinkcheckbox">
                                    <input type="checkbox" name="carddesign" id="confirm_form" className="pinkcheckbox" checked={this.state.ischecked} onChange={this.checking} />
                                    <label htmlFor="confirm_form" className="checkbox_wrap"></label>
                                </td>
                                <td className="label_cell label_cell_pinkcheckbox">
                                    Include Chinese Name?
                                </td>
                            </tr>
                        </table>
                    {this.state.Organisation == "IMDA" ? (<table className="body_titles" style={{ display: check }}>
                            <tr>
                                <td className="title_list_text">
                                    <h4>Personal Particulars</h4>
                                    <h5>For Chinese Namecard</h5>
                                </td>
                            </tr>
                        </table>):(<table></table>)}
                    </td>
                </tr>
                <tr>
                    <td>

                        <table className="form_block" id="chinese_content">
                         {this.state.Organisation == "IMDA" ? (<tr className="field_row" style={{ display: check }}>
                                <td className="label_cell">
                                    Chinese Name:
                                </td>
                                <td className="field_cell">
                                    <input type="text" id="cName" name="ChineseName" value={this.state.ChineseName} onChange={this.handleUserInput} />
                                    <span className='red'>{this.state.errChineseName}</span>
                                </td>
                            </tr>):(<tr></tr>)}

                         {this.state.Organisation == "IMDA" ? (<tr className="field_row" style={{ display: check }}>
                                <td className="label_cell">
                                    Chinese Designation :
                                </td>
                                <td className="field_cell">
                                    <input type="text" id="cDesignation" name="ChineseDesignation" value={this.state.ChineseDesignation} onChange={this.handleUserInput} disabled />
                                    <span className='red'>{this.state.errChineseDesignation}</span>
                                </td>
                            </tr>):(<tr></tr>)}
                            {this.state.Organisation == "IMDA" ? (<tr className="field_row" style={{ display: check }}>
                                <td className="label_cell">
                                    Chinese Division:
                                </td>
                                <td className="field_cell">
                                    <input type="text" id="cDivision" name="ChineseDivision" value={this.state.ChineseDivision} onChange={this.handleUserInput} />
                                    <span className='red'>{this.state.errChineseDivision}</span>
                                </td>
                            </tr>):(<tr></tr>)}
                            <tr className="field_row" style={{display: 'none'}}>
                                <td className="label_cell">
                                    Photo Upload:
                                </td>
                                <td className="field_cell">
                                    <input type="file" value={this.state.FileUpload} onChange={this.handleUserInput} />
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Direct <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">
                                    <input type="text" id="dNumber" name="DirectNumber" value={this.state.DirectNumber} onChange={this.handleUserInput} />
                                    <span className='red'>{this.state.errValidDirect}</span>
                                </td>
                            </tr>
                            <tr className="field_row">
                                <td className="label_cell">
                                    Mobile :
                                </td>
                                <td className="field_cell">
                                    <input type="text" id="mobile" name="Mobile" value={this.state.Mobile} onChange={this.handleUserInput} />
                                    <span className='red'>{this.state.errValidMobile}</span>
                                </td>
                            </tr>
                            {this.state.Organisation == "PDPC" && (<tr className="field_row">
                                <td className="label_cell">
                                    Fax <span className="red">* </span><b>:</b>
                                </td>
                                <td className="field_cell">                                    
                                    <input type="text" id="fax" name="Fax" value={this.state.Fax} onChange={this.handleUserInput} />
                                    <span className='red'>{this.state.errValidFax}</span>
                                </td>
                            </tr>)}
                             <tr className="field_row" style={{display:"none"}}>
                                <td className="label_cell">
                                    Attachment :
                                </td>
                                <td className="field_cell">
                                    <input type="file" name="fileToUpload" id="fileToUpload"/>
                                </td>
                            </tr>

                        </table>

                    </td>

                   </tr>
                <tr>

                    <td>

                    </td>
                    <td>

                    </td>
                </tr>

            </table>
            <ChooseBackground name={this.state.Title} FrontImages={this.state.FrontImages} Address={this.state.Address} images={this.state.images} deleteData={this.deleteData} updateData={this.updateData} data={this.state.data} SelectCard={this.state.SelectCard} 
            handleImages={this.handleImages} handleBox={this.handleBox} handleBackground={this.handleBackground} selectImage={this.selectImage} department={this.state.Department} division={this.state.Division} email={this.state.Email} Fax={this.state.Fax} 
            direct={this.state.DirectNumber} telephone={this.state.Telephone} mobile={this.state.Mobile} designation={this.state.Designation} selectedImage={this.state.selectedImage} handleBoxes={this.handleBoxes} Boxes={this.state.Boxes} Background={this.state.Background} 
            handleChanges={this.handleChanges} errBackImage={this.state.errBackImage} Organisation={this.state.Organisation} ChineseName={this.state.ChineseName} ChineseDivision={this.state.ChineseDivision} ChineseDesignation={this.state.ChineseDesignation} ischecked={this.state.ischecked} />
            <table className="section_table" id="section_submit">
                <tr>
                    <td>
                        <table className="form_block">
                            <tr className="field_row">
                                <td className="text-center">
                                    <button type="button" className="button button-pink submitbtn" onClick={this.submit}>Submit</button>
                                    <button type="button" className="button button-pink" onClick={this.cancel}>Cancel</button>

                                </td>
                            </tr>
                        </table>
							
                    </td>
                    
                </tr>
            </table>
            {this.bindErrors()}
            <table className="section_table" id="section_submit">
                <tr>
                    <td>
                        <table className="form_block">
                            <tr className="field_row">
                                <td className="text-center">
                                    &nbsp;
                                </td>
                            </tr>
                        </table>

                    </td>
                </tr>
            </table>

        </td>
        <td className="progress_side">
            <table className="progress_side_box">
                <tr>
                    <td>
                        <h2 className="other_titles">Completed Steps</h2>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ul>
                            <li><a href="#" className="step_number">1</a></li>
                            <li><span className="step_dot"></span></li>
                            <li><span className="step_dot"></span></li>
                            <li><span className="step_dot"></span></li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ul>
                            <li><a href="#" className="step_number">2</a></li>
                            <li><span className="step_dot"></span></li>
                            <li><span className="step_dot"></span></li>
                            <li><span className="step_dot"></span></li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ul>
                            <li><a href="#" className="step_number">3</a></li>
                            <li><span className="step_dot"></span></li>
                            <li><span className="step_dot"></span></li>
                            <li><span className="step_dot"></span></li>
                        </ul>
                    </td>
                </tr>
                <tr>
                    <td>
                        <ul>
                            <li><a href="#" className="step_number">4</a></li>
                        </ul>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
</table>);
}
});

var Error = React.createClass({
    render() {
        return (<div className="red">{this.props.item}</div>);
		}
	})
	
class ChooseBackground extends React.Component { 
    collectingdata() {
        return this.props.data.map((element, idx) => 
        <Context element={element} key={idx} index={idx} images={this.props.images} Address={this.props.Address} deleteData={this.props.deleteData} selectImage={this.selectImage} Boxes={this.props.Boxes} Background={this.props.Background} handleChanges={this.props.handleChanges} handleBoxes={this.props.handleBoxes} selectedImage={this.props.selectedImage} name={this.props.name} 
   			 division={this.props.division} department={this.props.department} Organisation={this.props.Organisation} email={this.props.email} Fax={this.props.Fax} telephone={this.props.telephone} mobile={this.props.mobile} designation={this.props.designation} direct={this.props.direct} ChineseName={this.props.ChineseName} ChineseDivision={this.props.ChineseDivision} ChineseDesignation={this.props.ChineseDesignation}
    	{...this.props} />)
	}
	render() {
		    return (<table>
	        <table className="section_table backgroundsection" id="section_quantity"  >
            <tr>
                <td>
                    <table className="body_titles">
                        <tr>
                            <td className="title_list_icons"></td>                            
                            <td className="title_list_text"> </td>                           
                        </tr>
                    </table>
                </td>
            </tr>
            <tr>
                <td>
                	
                    <table className="form_block">
                        <tr className="field_row"> <td className="label_cell">Front Card Design<span className="red">*</span><b>:</b></td> 
								<td className="field_cell">
	    							<select name="backgound_qty" id="back_qty" value={this.props.Background} onChange={this.props.handleChanges}>
	        							 <option>Please Select</option>
	        							 {
	        							 this.props.FrontImages.map((item,idx)=><option key={idx}>{item.Title}</option>)
	        							 }
	        							 
	    							</select>
								</td>
								<td className="label_cell" style={{ paddingLeft : 30+ "px"}}>   No of Boxes <span className="red">* </span><b>:</b></td>    
								<td className="field_cell backgroundbox">
	   								<select name="boxes_qty" id="boxes_qty1" value={this.props.Boxes} onChange={this.props.handleBoxes}>
	        								<option>Please Select</option>
	        								<option>1</option>
	       								   	<option>2</option>
	       									<option>3</option>
	       									<option>4</option>
	        								<option>5</option>
	        								<option>6</option>
	       									<option>7</option>
	        								<option>8</option>
	        								<option>9</option>                                     
	   							  </select>                 
	   						  </td>
					
					</tr><tr className="field_row"></tr>
						</table>	
			
			<span className="red" style={{display: this.props.SelectCard}}>Please select all these fields choose card template,no of boxes and back card design</span>						     	
	</td>
	</tr>
</table>
<BackCard images={this.props.images} selectImage={this.props.selectImage} updateData={this.props.updateData} errBackImage={this.props.errBackImage} />
	<table className="section_table " id="section_preview">
	    <tr>
	        <td>
	            <table className="body_titles">
	                <tr>
	                    <td className="title_list_icons">
	                    </td>
	                    <td className="title_list_text">
	                    		
	                    </td>
	                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>
            <table className="form_block">
                <tr className="field_row">
                    <td className="label_cell">
        Requested :
                         </td>
                            <td className="field_cell">
                                <table className="requested">
                                    <tr className="field_row">
                                        <th className="label_cell">
                                            Template Choosen
                                        </th>
                                        <th className="label_cell box">
                                            No of Boxes
                                        </th>
                                        <th className="label_cell box">
                                            Back Design Choosen
                                        </th>
                                    </tr>
                                        
    {this.collectingdata()}

   			 </table>
		</td>
			</tr>

			</table>

			</td>
		</tr>
		</table>

		</table>)
	}
	}

class Context extends React.Component {
getcardpreviewURL() {
        return "/bcs/pages/cardpreview.aspx?" + "card=" + encodeURIComponent(this.props.element.background) + "&Name=" + encodeURIComponent(this.props.name) + "&Division=" + encodeURIComponent(this.props.division) + "&Department=" + encodeURIComponent(this.props.department) + 
            "&Email=" + encodeURIComponent(this.props.email)+ "&Fax=" + encodeURIComponent(this.props.Fax) + "&Telephone=" + encodeURIComponent(this.props.element.telephone) + "&Direct=" + encodeURIComponent(this.props.direct) + "&Mobile=" + encodeURIComponent(this.props.mobile) + "&Designation=" + encodeURIComponent(this.props.designation) + "&selectedImage=" + this.props.element.selectedImage +
            "&AddressLine1=" + encodeURIComponent(this.props.Address)+ "&Organisation=" + encodeURIComponent(this.props.element.organisation) + "&ChineseName=" + encodeURIComponent(this.props.ChineseName) + "&ChineseDesignation=" + encodeURIComponent(this.props.ChineseDesignation) + "&ChineseDivision=" + encodeURIComponent(this.props.ChineseDivision)}
render() {
     return (<tr className="gradient"><td>{this.props.element.background} </td> <td className="box">{this.props.element.boxes}</td><td className="box">{this.props.element.selectedImage.replace(/^.*[\\\/]/, '')}</td>             
           		<td><a className="button button-pink" onClick={()=> window.open(this.getcardpreviewURL(),"myWindow",'width=980,height=660,resizable=1, scrollbars=1')}>Preview</a></td> 
            	<td>
                <button type="button" className="button button-pink" onClick={this.props.deleteData.bind(this, this.props.index)}>Delete</button>                
           		</td>
            </tr>)       
    }
}

class BackCard extends React.Component {
constructor() {
        super()
        this.state = {  images: [] }   
}
renderImage(){
        var array = this.props.images;
        if(this.props.images.length == 1 ){
        array.push("");
        array.push("");        
        }
        else if(this.props.images.length == 2){
        array.push("");
        }
        if(array.length > 0){
            var i=0;
            var temp=Math.round((array.length+1) / 3);
            var newTemp =temp+3
            return array.slice(0,temp).map((elements,idx)=>
            <BackCardImage elements={array.slice(i,i=i+3)} key={idx} selectImage={this.props.selectImage} />)                                                            
            }
}
render() {
return(<table className="section_table" id="section_design">
   		<tr>
        <td>
            <table className="body_titles">
                <tr>
                    <td className="title_list_text">
                        <h4>Back Card Design</h4>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
    <tr>
        <td>
            <h2 className="other_titles">Click on the checkbox to select <span className="red">* </span><b>:</b></h2>
            <span className="red" style={{display : this.props.images.length == 0 ? "block" : "none" ,fontSize:20 + "px"}}>No Back Card Design</span>
            <table className="form_block" id="checkboxcards">
                {this.renderImage()}
            </table>
            <td className="field_cell add"><button type="button" className="button button-pink" id="addButton" onClick={() => this.props.updateData()}>+Add</button></td>
        	<span className='red'>{this.props.errBackImage}</span>
        </td>
    </tr>
</table>)
  	  }
}
	
class BackCardImage extends React.Component{
render(){
var that = this ;
return(<tr className="field_row">
         {
             this.props.elements.map(function (item,idx) {
               {
                if(item.BackCardImage){
                 return( <td className="label_cell" key={idx} >
						 <img src={item.BackCardImage} alt="" />
						 <input type="checkbox" name={"carddesign"+ '[' + item.ID+ ']'}  id={item.ID} className="pinkcheckbox" onChange={that.props.selectImage.bind(null,item.BackCardImage,item.Title)}  />
						 <label htmlFor={item.ID}  className="checkbox_wrap" ></label>
						 <span style={{marginLeft:20+'%'}}>{item.Title}</span>
						</td>)
				}else {
				return( <td className="label_cell" key={idx}></td>)				
				}
			}		
						
 			  })
   		}
		</tr>)
	}
}

ReactDOM.render(<BuisnessCard />, document.getElementById("buisnessCard"))




