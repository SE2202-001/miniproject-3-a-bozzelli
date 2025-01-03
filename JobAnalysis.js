
/*code sources used
understaning how to ensure json file based on MIME types found here:
 https://developer.mozilla.org/en-US/docs/Web/API/File_API/Using_files_from_web_applications

how to read javascript web files using filereader.readastext() found here:
 https://www.geeksforgeeks.org/how-to-read-a-local-text-file-using-javascript/#filereaderreadastext

understanding how json.parse works here:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/JSON/parse

Creating a new element for job display:
 https://www.w3schools.com/jsref/met_document_createelement.asp

Understanding Sets:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Set

how to add extra options to drop down:
 https://www.w3schools.com/jsref/met_select_add.asp

learning how filter works
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/filter

Understanding sort functionality:
 https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort

Line breaks in html:
 https://stackoverflow.com/questions/39325414/line-break-in-html-with-n

how to create popups: 
 https://www.w3schools.com/howto/tryit.asp?filename=tryhow_js_popup
 https://www.youtube.com/watch?v=r_PL0K2fGkY 
 https://stackoverflow.com/questions/19467693/how-to-make-popup-look-at-the-centre-of-the-screen did'nt use as popup 
*/


//public/used everywhere variables

const Jobs = []; // job array to store all the different jobs from json is made public so can be filtered and sorted



//FILE LOADING SECTION___



const errorMessage = document.getElementById('errorMessage'); //add DOM elements
const fileloading = document.getElementById('fileInput');

fileloading.addEventListener('change', FileUpload); // set event to change if user decides to change inputted file
function FileUpload(event){
    file = event.target.files[0]; //gets first singular file

    if(!file){ //if file doesn't exist
        errorMessage.textContent = "No file found, try a json file";
        return;
    }


    if(file.type !== 'application/json'){ //checks if json file based on MIME type
        errorMessage.textContent = "Wrong file type, try a json file";
        return;

    }

   
try{ 
    let reader = new FileReader(); //creates file reader

    reader.onload = function () { //once loaded start function
        try {
            const FileContent = JSON.parse(reader.result); //   reads and parses data 
            createAllJobs(FileContent) //                       creates jobs after reader result is done sync with reader
            errorMessage.textContent = ''; //                   empty error message
           
        } catch (parseError) {  // error checking
            errorMessage.textContent = "Error parsing JSON file. Double-check file format.";
            return;
        }
    };

    reader.readAsText(file); // reads file and then creates a callback to onload

}catch{ // error checking
    errorMessage.textContent = "Error reading file, Double check file isn't corrupt"
    return;
}

}




//FILE LOADING SECTION ^^^



//CONSTRUCTOR SECTION___




class Job{
    // job constructor based off listed paramaters in assignment and named based on json file
    constructor(Title, Posted, Type, Level, Skill, Detail){ 
        this.Title = Title;
        this.Posted = Posted;
        this.Type = Type;
        this.Level = Level;
        this.Skill = Skill;
        this.Detail = Detail;
    }

    getFormattedPostedTime() { //gets time posted
        return `Posted: ${this.Posted}`;
    }

    getDisplay(){ //retruns basic info to display
        return `${this.Title} - ${this.Type} (${this.Level}) - ` + this.getFormattedPostedTime();
    }

    getDetails() { //returns details when clicked
        //prints out statement
        return `Title: ${this.Title}\nType: ${this.Type}\nLevel: ${this.Level}\nSkill: ${this.Skill}\nDescription: ${this.Detail}\n\n` + this.getFormattedPostedTime();
    }

    
}




//CONSTRUCTOR SECTION^^^



//CREATE AND DISPLAY JOBS SECTION___




let joblist = document.getElementById('Job Display'); //used for job display

function createAllJobs(data){
    


     for(let job of data){ // goes through each element (singular json object) in array
        Jobs.push( new Job(job.Title, job.Posted, job.Type, job.Level, job.Skill, job.Detail)); //adds new json object/job to array
        }

        populateSets(Jobs); //populates filter sets
        SortJobs(); // pre sort jobs
        displayJobs(Jobs); //calls display jobs function
        
        
     }




function displayJobs(jobs) { //displays jobs
    joblist.innerHTML = ''; // Clear previous content

        for(let job of jobs){
            const jobElement = document.createElement('div'); //creates new element

            //adds event listener so if object/job is clicked displayDetails is called and passes job as argument
            jobElement.addEventListener('click', function(){displayDetails(job)}); 

            jobElement.innerHTML = `<div class = "Job clickable">` + job.getDisplay(); 
                                    + `</div>`; // inner html used so styles can be edited
            joblist.appendChild(jobElement); // adds element to joblist to be displayed
        }


        if(joblist.innerHTML === ''){ // if jobs submitted empty tell user
            const jobElement = document.createElement('div');
            jobElement.innerHTML = `<div style = "font-size: large; font-weight: bold; color: blue; padding: 14px;">`
                                    + 'No Jobs Found' +  `</div>`; // inner html used so styles can be edited
            joblist.appendChild(jobElement); // adds element to 
        }
}




//CREATE AND DISPLAY JOBS SECTION^^^




// FILTERING SECTION___



const LevelFilter = document.getElementById('Level'); //dom elements for drop down filter bar
const TypeFilter = document.getElementById('Type');
const SkillFilter = document.getElementById('Skill');

function populateSets(jobs){
    const Levels = new Set(); //create new sets
    const Types = new Set();
    const Skills = new Set();

    for(let job of jobs){ //go through array of jobs add to set (set ensures no duplicates)
        Levels.add(job.Level);
        Types.add(job.Type);
        Skills.add(job.Skill);
         
    }
    populateDropdown(LevelFilter,Levels); //populate each select/dropdown
    populateDropdown(TypeFilter,Types);
    populateDropdown(SkillFilter,Skills);
    


}

function populateDropdown(Element, set){ //small function to reduce repeating code

    for(let content of set){
        let Option = document.createElement("option"); //adds set as options
        Option.textContent = content;
        Element.add(Option);
    }

}


//button to confirm
const confirmFilter = document.getElementById('filterbutton'); //DOM element for confirm button

confirmFilter.addEventListener('click',filterJobs); //sees if button is clicked

function isValid(job){
    const Level = LevelFilter.value; //gets selected drop down value
    const Type = TypeFilter.value;
    const Skill = SkillFilter.value;

        LevelTest = false; //sets to false
        TypeTest = false;
        SkillTest = false;
        if((job.Level === Level)||Level === 'All'){ //if matches or is set to All then pass
            LevelTest = true;
        }
        if((job.Type === Type)||Type === 'All'){
            TypeTest = true;
        }
        if((job.Skill === Skill)||Skill === 'All'){
            SkillTest = true;
        }

    if(LevelTest && TypeTest && SkillTest){ //if all three pass it wont be filtered out
        return true;
    }else{
        return false;
    }

}

//mass/main general function to call
function filterJobs(){
    const filteredjobs = Jobs.filter(isValid); //filters using isvalid function
    displayJobs(filteredjobs);


}



//FILTERING SECTION ^^


//SORTING SECTION___



const confirmSort = document.getElementById('Sortingbutton'); //DOM element for confirm button
const Sorting = document.getElementById('SortingSelect'); //DOM elemnt for choosing how to sort

confirmSort.addEventListener('click',SortJobs)

function SortJobs(){ //sorts entire array not just filter so is unaffected by filters display calls
    const SortSelected = Sorting.value; //value selected

    if(SortSelected === 'A-Ztitle'){ //sorts main Jpb array as it means filtered items are always sorted
        SortbyTitle(Jobs,'false');
    }else if(SortSelected === 'Z-Atitle'){ //reverse order
        SortbyTitle(Jobs,'true');
    }else if(SortSelected === 'NewestTime'){
        Jobs.sort((a,b) => convertToMinutes(a.Posted) - convertToMinutes(b.Posted)); //sorts by value after converting
    }else if(SortSelected === 'OldestTime'){
        Jobs.sort((a,b) => convertToMinutes(b.Posted) - convertToMinutes(a.Posted)); // reverse order

    }
    
filterJobs(); //filter jobs after to ensure same list as display also calls displayjobs
   

}

function SortbyTitle(jobs,reverse){ //title reverse

    
    jobs.sort((a,b) =>{ //sort function and permenatly edits main jobs array

        //create new values to compare and convert to uppercase for even comparison
        const aValue = a.Title.toUpperCase();
        const bValue = b.Title.toUpperCase();

        //basic comparator learned in 2205 data structures returns positive if first greater negative if less than
        if(reverse === 'false'){
        if(aValue < bValue){
            return -1;
        }else if(aValue > bValue){
            return 1;
        }else{//means same value
            return 0;
        }

        }else if(reverse === 'true'){ // pointless to check but shows idea if want set to true then reverse order switch results -1 = 1
            if(aValue < bValue){
                return 1;
            }else if(aValue > bValue){
                return -1;
            }else{
                return 0;
            }
        }

    });
   

}

function convertToMinutes(str){
    const strParts = str.split(' ');//splits into array of words
    const timeStr = (strParts[1].substring(0,3)).toUpperCase(); //break into first 3 letters and remove cases so consistent case checking
    const timeValue = parseInt(strParts[0]);
    let timeMultiplier = 1;

    switch(timeStr){
        case 'MIN': // minute
            timeMultiplier = 1;
            break;
        case 'HOU': // hour
            timeMultiplier = 60;
            break;
        case 'DAY': //Day
            timeMultiplier = 1440;
            break;
        case 'WEE': // week (day * 7)
            timeMultiplier = 10080;
            break;
        case 'MON': //month (day *30)
            timeMultiplier = 43200;
            break;
        case 'YEA': //year (day * 365)
            timeMultiplier = 525600;
            break;
    }

    return timeValue*timeMultiplier; //retrun normalized time
    
}



// SORTING SECTION ^^^


// Interactibilty/popup Section

const closePopup = document.getElementById("closePopup");
const popupInner = document.getElementById("popupInner");
const popupText = document.getElementById("popupText");

closePopup.addEventListener('click',()=>popupInner.classList.remove("show"));//removes visibility


function displayDetails(job){
    popupText.textContent = job.getDetails(); //inputs new text function
    popupInner.classList.toggle("show"); //toggles visibility

}


//interactibilty Section^^^
