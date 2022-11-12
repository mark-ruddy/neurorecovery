NOTES: the focus is on upper limb, but the app will support some leg work etc.

# Abstract
TODO - just use original abstract for now and come back to this at the end with more specifics

# Background
## Problem Statement
Over 20 million people suffer from stroke annually. In the UK there are 1.3 million stroke survivors, with 39 thousand stroke survivors in Northern Ireland alone [1]. Up to 40% of stroke survivors suffer from permanent upper limb (UL) paralysis, which may affect their quality of life dramatically [2].

It has been clinically established that "using a rehabilitation protocol involving motor imagery (MI) practice in conjunction with physical practice (PP) of goal-directed rehabilitation tasks leads to enhanced functional recovery of paralyzed limbs among stroke sufferers." [3].

Generally stroke survivors will attend sessions with professional physiotherapists. However, attending physiotherapy sessions is expensive and limited to set dates. Additionally if exercises are performed with a physiotherapist's assistance, the patient may not apply his/her best effort in the rehabilitation tasks. This can result in inadequate neuroplasticity required for recovery of their motor function. 

The NeuroRecovery app aims to enhance neuroplasticity related to motor function for patients, by providing an app to manage physical practice (PP) of rehabilitation tasks which is accessible at all times on the patients mobile phone.

## Aims and Objectives
### Aims
To provide management of PP rehabilitation tasks for stroke survivor patients with an Android app. The app will primarily focus on UL motor recovery, though it will provide supplementary sections for lower-limb as well. This should be accomplished by providing demonstration videos, reminder notifications and consistent feedback to patients as they use the app. The app should be performanant and compatible with older Android phones which are accessible to the majority of patients.

#### Sessions
To support scheduling of appointments and exercise sessions, which may be followed by a video call with a therapist in some cases. Sessions should have sane defaults so they can be created with minimal involvement on the patient or therapist's side, while also being configurable enough for sessions that require specific changes based on the patient's need. Sessions may be categorised into solo or therapist based, as one of the aims of the app is to be useful to patients when they do not have access to a therapist on that day or week.

Exercise sessions may require some tailoring based on the patient's data, such as reducing the intensity for patients who are elderly or have persistent hypertension, "There is a rationale for delaying moderate to higher intensity exercise in the elderly, as well as those with persistent hypertension and/or diabetes/hyperglycemia" [4].

#### Demonstration Videos
The app will have demonstration videos for the patient to watch during an exercise session. These videos should be vetted to include the correct exercise with timings that match the exercise session. This is expected to require extensive usage of the Android Video Playback API, for example to rewind the video a certain number of seconds to the beginning of the exercise in cases where that is required.

#### Notifications
Notifications should be triggered in situations where they have a clear intent, and avoided in situations where they are not necessary. The most common notification will be to remind the patient and therapist of an upcoming exercise session. Notifications have been found as "mechanism to provide passive awareness rather than a trigger to switch tasks" [5], which is helpful in the situation of being reminded and aware of an upcoming exercise session. Without notifications, some users may actually spend more time checking an email or calendar for updates, "Turing off notifications cause some users to self interrupt more to explicitly monitor email arrival" [5].

#### UI/UX
The apps UI/UX should be clear and easily navigatable by patients.

TODO - update here when I know what UI/UX will be

#### Patient Data Storage and Authentication
The storage of patient information should follow the latest security standards for storing medical data. For the NeuroRecovery app Google Firebase will be used for data storage, user authentication and analytics [6]. Firebase is well established as a backend framework for Android apps, and follows latest security standards suitable for storing patient medical data.

An alternative to Firebase would have been to develop a custom backend server, possibly using the Go net/http library [7] or the Rust Actix-Web framework [8]. Firebase was chosen over these due to its excellent integration with Android apps through APIs. In the case of the NeuroRecovery app, a custom backend has no significant advantage over Firebase but would entail much more development time.

### Objectives
The NeuroRecovery app's objectives are as follows:

- Schedule exercise sessions and issue reminder notifications
- Display timings for the patient to perform repetitive exercises in a specified order and frequency
- Demonstrate the movement to the patient through a video
- Storing of patient information, details of rehabilitation tasks and recovery outcomes
- Providing neurofeedback in terms of changes in motor impairment to the patient

## Summary of the report
TODO - do this after majority of report done, will be a better summary

# Research and Analysis
## Literature Review
There are many different existing programs or apps to assist with post-stroke UL recovery. These apps use a wide range of technologies, including Virtual Reality(VR) and even adaption of gaming systems such as the Xbox towards recovery training [9].

### mHealth
An existing paper has explored feedback from US and Ethiopian rehabilitation clinicians for the development of an app called mHealth to assist with stroke recovery. Three app functionalities that received the perceived highest importance from respondantonts were: The rehabilitation team can modify the patients treatment plan, video-record arm function for later analysis and to automatically log and update performance in a number of factors [10]. This data will be important in deciding which features to include in the NeuroRecovery app[TODO - can you word stuff like this].

Other features that are related to the NeuroRecovery app which were marked as "very important" but not as highly important as the previously mentioned features: Display content in languages relevant to the country or region, remind users to complete their rehabilitation exercises or go to an in-person appointment and to display appointments [10]. Some features that are not relevant to the NeuroRecovery app itself are omitted from this discussion, such as displaying patient health insurance information or to allow the patient or caregiver to pay through the app for healthcare services.

### Italian Post-Stroke Checklist (PSC) Software
An Italian post-stroke checklist (PSC) software has overlap with the NeuroRecovery app, especially in relation to collecting stroke patient information and parsing it into usable data. In comparison to using a physical paper questionaire, the researchers found that "the web version of PSC had two important advantages: (1) clinicians may have an easy access to the PSC wherever they are visiting the patient just using a PC, a tablet, or a smartphone with an internet connection and (2) the data are saved on a database for further analyses." [11]. 

The findings of a PSC set of 42 post-stroke patients in the UK also highlights the unmet needs once they leave healthcare. 63.4% reported unmet abscene of secondary prevention needs, and 56.1% reported unmet mobility needs [11]. The NeuroRecovery app is targeting these post-stroke patients, who have left treatment but have unmet needs in relation to mobility and secondary prevention.

### Effect of Early Upper-Limb Training on Stroke Recovery
It is relevant for the NeuroRecovery app to consider the effects of exercise intensity and timing on neuroplasticity in patients. The investigated study was organised as such, "The study recruited 23 participants. Of these, 12 were randomized to the standard-care group and had a mean age of 69.3 years, and 11 were randomized to the intensive training group and had a mean age of 61.7 years" [12].

The study found that between the standard and intensive care group, "There were no significant between-group differences in change over time in the clinical outcome scores" [12]. However, the intensive care group had slightly increased recovery in some areas, "This preliminary study is the first to show that more intensive rehabilitation (task-specific UL training) in the first month poststroke is associated with increased brain activation in putative motor and attention areas" [12].

From the NeuroRecovery apps perspective, this implies that a focus should be made on having the patients complete the exercises consistently instead of a focus on exercise intensity. This is because an Android app should not be expected to fill the abilities of an intensive physical post-stroke care group, if a large recovery can be encouraged without intensive exercise the NeuroRecovery app may lean towards this solution.

## Investigatory Process
### mHealth Considerations
mHealth was discussed in the literature review section due to it being a useful source of clinician perceived requirements in a mobile app for post-stroke patients.

The functionalities being reviewed by the clinicians for mHealth are quite broad, for example including a feature for displaying patient health insurance information. The NeuroRecovery app will focus on developing high quality features instead of a high quantity of features, so that they can be delivered in a reasonble time as a Minimum Viable Product (MVP). It may be enticing to aim for a large quantity of features in an app during its early stages, but this is likely to overload the developer(s) and result in slower development. Reaching an MVP is also highly important for receiving feedback on a product earlier, "To find and develop the right product that can help them become established and successful in the market, startups need to validate their minimum viable product (MVP) as quickly as possible until a product-market fit is attained" [13].

### Italian Post-Stroke Checklist (PSC) Software Considerations
As was highlighted in the literature review, the PSC survey carried out in the UK showed that the majority of patients had unmet mobility needs and unmet absence of secondary prevention needs after leaving treatment. Some of these patients who still have unmet needs post-treatment may wish to use the NeuroRecovery app, which will be more accessible and less expensive than returning to treatment.

Another consideration of the PSC is the advantages of it being available online, "The great advantage of using online PSC to unveil unmet needs was the administration to patients by general practioners" [11]. The NeuroRecovery app should take this into account, and ensure that it is available online for both patients and therapists to easily access. In the case of an Android app, the Google Play Store is installed by default on all Android devices and will likely be the best place to hose the NeuroRecovery app [14].

## Requirements Specification
TODO - this is like user stories and requirements, should be nice section to do

## Project Management
TODO

# Design
## Design Rationale
### App Sections
In the app's navigation menu, the following sections will be present for users to select between:

- Instant Exercise Session: Users can choose to start an exercise session immediately. This will allow users to complete a video-assisted exercise session without a therapist being present.
- Scheduled Exercise Session: Users can schedule an exercise session for a specific time and date with a therapist. The scheduling will be integrated with Google or Outlook calendar[TODO].
- Update User Info: Section for a user to update their information. The user may be either a therapist or a patient, and the information requested will depend on this.

### User Interaction and Experience(UI/UX)
The NeuroRecovery apps User Interaction and Experience(UI/UX) is intended to be straightforward for the user to navigate and interact with. The core of the UI/UX for this app is the toolbar at the top of the screen and the collapsable menu at the left of the screen. These two elements will be present in all sections, which provides navigation access and style consistency throughout the entire app.

In the center-right of the screen, the area not taken up by the toolbar or collapsable menu, is where the content of each section will be displayed. This may be a login form with a username and password field, a instant exercise section with <TODO>, etc. This storyboard visually displays the concept:

TODO - add storyboard image

The login form adheres to the UI/UX concept of the storyboard, with the toolbar and collapsable menu present and the login form section content in the center-right:

![Login Form](images/frontend/login.png)

When users visit the app they will be placed by default in the instant exercise session section <TODO>

### Angular Material
The frontend is developed with the Angular framework using Google's material UI theme, referred to as "Angular Material". The language used for Angular is Typescript, a superset of Javascript with strong types which compiles down to Javascript to run in the browser [TODO].

### Single Page Applications(SPAs)
Angular is used to create Single Page Applications(SPAs). In web development, SPAs reduce the amount of HTTP requests and responses between the user and the server. The first request from the user is responded to with a bundle which includes the entire apps frontend content, including Javascript code. The user can then interact with the SPA without making further requests, despite switching between simulated pages which can be referred to as sections. This concept is very visible in the NeuroRecovery app, the switching between the login form and the instant exercise section for example is seamless and instant, since both sections are already present in the user's browser without further HTTP requests.

While SPAs do make frontend interaction instantaneous, backend interaction from the frontend becomes more complex. Since the user will be interacting with bundled Javscript code in their browser, communication with the backend involves crafting and sending a HTTP request to the backend server from the user's browser. In a non-SPA, the user is always making HTTP requests directly to the backend to receive each page, and any backend only interaction such as database updating can be handled then.

### Material
Material is a set of UI components and theming concepts developed by Google [TODO]. Google have specifically developed a plugin[TODO] for the Angular framework, and apps that use this plugin are commonly referred to "Angular Material" apps. The NeuroRecovery 

## Modelling
TODO - maybe draw one model before developing app, then finish this section after developing with diagrams for the models and descriptions

# Summary

# References
1. Stroke Association: Stroke Statistics (2018). Retreived from https://www.stroke.org.uk/what-is-stroke/stroke-statistics
2. World Health Organisation: Global Report (2002). Retreived from http://www.who.int/whr/2002/en/index.html
3. Prasad G, Herman P, Coyle D, McDonough S, Crosbie, J: Applying a brain-computer interface to support motor imagery practice in people with stroke for upper limb recovery: A feasibility study, Journal of NeuroEngineering and Rehabilitation, 7:60 (2010).
4. Marzolini S, Robertson AD, Oh P, Goodman JM, Corbett D, Du X, MacIntosh BJ. Aerobic Training and Mobilization Early Post-stroke: Cautions and Considerations. Front Neurol. 2019 Nov 15;10:1187. doi: 10.3389/fneur.2019.01187. PMID: 31803129; PMCID: PMC6872678.
5. Shamsi T. Iqbal and Eric Horvitz. 2010. Notifications and awareness: a field study of alert usage and preferences. In Proceedings of the 2010 ACM conference on Computer supported cooperative work (CSCW '10). Association for Computing Machinery, New York, NY, USA, 27–30.
6. Firebase is an app development platform that helps you build and grow apps and games users love (2022). Retreived from https://firebase.google.com/
7. Let's Go! Learn to Build Professional Web Applications with Go (2022). Retreived from https://lets-go.alexedwards.net/
8. Zero To Production In Rust: An introduction to backend development (2022). Received from https://www.zero2prod.com/
9. K. Morrow, C. Docan, G. Burdea and A. Merians, "Low-cost Virtual Rehabilitation of the Hand for Patients Post-Stroke," 2006 International Workshop on Virtual Rehabilitation, 2006, pp. 6-10, doi: 10.1109/IWVR.2006.1707518.
10. Hughes CML, Padilla A, Hintze A, et al. Developing an mHealth app for post-stroke upper limb rehabilitation: Feedback from US and Ethiopian rehabilitation clinicians. Health Informatics Journal. 2020;26(2):1104-1117. doi:10.1177/1460458219868356
11. Iosa M, Lupo A, Morone G, Baricich A, Picelli A, Panza G, Smania N, Cisari C, Sandrini G, Paolucci S. Post Soft Care: Italian implementation of a post-stroke checklist software for primary care and identification of unmet needs in community-dwelling patients. Neurol Sci. 2018 Jan;39(1):135-139. doi: 10.1007/s10072-017-3140-1. Epub 2017 Oct 30. PMID: 29086123.
12. Hubbard IJ, Carey LM, Budd TW, et al. A Randomized Controlled Trial of the Effect of Early Upper-Limb Training on Stroke Recovery and Brain Activation. Neurorehabilitation and Neural Repair. 2015;29(8):703-713. doi:10.1177/1545968314562647
13. Nirnaya Tripathi, Markku Oivo, Kari Liukkunen, Jouni Markkula, Startup ecosystem effect on minimum viable product development in software startups, Information and Software Technology, Volume 114, 2019, ISSN 0950-5849
14. Google Play Store (2022). Retreived from https://play.google.com/store/apps

---------------------
# Appendices
## Appendix C Code
## Appendix D Test Suite
