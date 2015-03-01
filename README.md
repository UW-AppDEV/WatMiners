# WatMiners
Co-op ranking shouldn't be a pain. 

#Project Requirements are listed as the follows: 
* students login using Waterloo's Quest credentials, website provides backend integration with CAS
* a database that links JobID to the job description on jobmine, please refer to Waterloo's Open Data API to see if this is feasible
* we may allow students to enter the jobs they applied for (jobID and ranking) ONLY ONCE, this is to prevent frequent changing of their ranking information that messes around other people, however, they are allowed to change their preferences any time
* we will be displaying all candidates' questID rather than their real name, since that's the only information we can get from Waterloo's CAS system. students are encouraged to email other candidates to discuss about their own decisions

#Choice of language and frameworks: 
* MEAN stack, database integration done by REST API

# Frontend Workflow: 
student login -> student enter their jobID, job rankings and their own preferences with number 1 - 9, if they have already done so, jump to the next step -> a simple interface that displays all candidates who applied to the same job as the user, and their ranking and preference info

#ADVANCED FEATURE: 
* spam detection and report. people may peek at others job application by entering jobID for the job they never applied to, we can develop a "report" button that allows other students to report such a person
* encourage others to share their ranking: uses Facebook API or email to encourage people to share their info. since every student knows the list of people who applied the same job, one can enter those names to invite them to WatMiners

=================THIS IS THE INCENTIVE FOR THE PROJECT=================
FACEBOOK POST: 

I would like to ask for help on this website “WatMiners” for co-ops in Waterloo.

Every year ranking is a big decision for co-ops. 

Imagine that you have an offer from company A, but you are "ranked" for company B which you would like to go. Do you take the offer from A which is more secure, or do you take a chance to rank B as your top choice? 

It will be nice if we can have a central information sharing website where students discuss about their ranking preferences. If you know that whoever has an offer from B is taking the job, you don’t have much choice other than taking the offer from A; on the other hand, if you know that the person is not taking B's offer, there is a chance. It's all about information sharing.

If you find this useful, let's build it so that more people can benefit. The more people use it, the better it will be.

Comment in this document your email address and Github username so I can add you to the chatting channel and github repo. Also it includes additional information such as whether Waterloo Works is going to change anything. 
https://docs.google.com/document/d/18Xc3wU2jbKHHv_N7GG5QBw45B-y68WvtnUc0PdrDwuc/edit?usp=sharing


Additional Info: 

A detailed ranking algorithm is available here. https://uwaterloo.ca/co-operative-education/get-hired/ranking-matching

Several students have similar complaints: 
http://www.tinyepiphany.com/2009/11/way-to-improve-jobmine-matching-process.html
http://www.reddit.com/r/uwaterloo/comments/2ubizx/fix_jobmines_algorithms/
http://a-notebook.blogspot.ca/2009/11/way-to-improve-jobmines-matching.html

Waterloo Works is replacing jobmine, but it doesn’t seem that they are changing anything about the matching algorithm, and disclosing ranking information.
https://uwaterloo.ca/co-operative-education-career-action-systems/waterlooworks/key-process-changes
We may as well build our website and sell it to CECA! 

