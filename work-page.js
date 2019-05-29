function makeSubpageElement(subpageName, subpageID){
	var newLI = document.createElement("LI");
	var newA =  document.createElement("a");
	$(newA).html(subpageName)
	if (subpageID !== "default"){
		$(newA).attr("href","#"+subpageName.replace(" ","-"));
	} else{
		$(newA).attr("href","#");
	}
	
	$(newLI).addClass("subpage subpageName");
	$(newLI).attr("subpageID",subpageID);
	newLI.appendChild(newA);
	return newLI;
}



var pageInitiallyPopulated = false;
	
Vue.component('work-summary', {
  props: ["dontusecoverphoto","worktype", "donefor", "toolsused", "externallink", "linktext", "coverphoto", "githublinkimg","externallinkimg"],


template: '<div><img v-if=!(dontusecoverphoto) id="coverPhoto" src=coverphoto class="three-fourth-center box-shadow scroll-reveal">' +
		'<div class= "grid-container center-align details"> ' +
			'<div class="fourth ">' +
				'<h4>work in</h4><p v-html=worktype></p></div>'+
			'<div class="fourth">'+
				'<h4>done for</h4><p v-html=donefor></p></div>'+
			'<div class="fourth">'+
			'<h4>using</h4><p v-html=toolsused></p></div>'+
			'<div class="fourth">'+
			'<h4><a target="_blank" href=link>{{linktext}}<br>'+
			'<div v-if=githublinkimg><img  src="/img/githublogo.png"></div>'+
			'<div v-if=externallinkimg><img  src="/img/interactiveicon.png"></div>'+
			'</a></h4>'+
			'</div>'+
		'</div></div>'
});



Vue.component('workpage-nav', {
  props: ["work", 'subpage'],
  template: 	'<div class="links nav is-sticky" id="navbar">'+
		'<div class="nav-wrapper">'+
		'<a class="nav-name" href="/"></i> jackie liu</a> '+
		'<span  id="nav-portfolioPageTitle">-><a style="color:black!important" href="/projects">All Projects</a>-> <span v-html=work></span></span>'+
		'<ul class="nav-pagination"></ul></div>'+
		'</div>'
});

		// '<span class="hide-for-mobile" v-if="subpages.length > 0" id="nav-portfolioPageTitle">-><a style="color:black!important" href="/projects">All Projects</a>-> <span v-html=work></span></span>'+


var projectPage = new Vue({
	  el: '#work-page-wrapper',
	  data: {
	  	sectionTitle: "",
	    lastUpdated: "",
	    workTitle: "",
	    workType:"",
	    doneFor: "",
	    toolsUsed:"",
	    timePeriod:"",
	    description:"",
	    subheading:"",
	    subpagesList:[],
	    descriptionContents: "",
	    hasSubpage: false
	  }
	});

$("body").css("opacity",1);
// $("body").css("margin",0);
