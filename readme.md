# Music Room
### **Description:** Stream Music and chat together with friends in real-time.
---
### **Features:**
* Authentication (login/reg/logout)

* Front/Landing Page Hook Display

* "Music Room"

    *   Chat
    *   Music Playlist Queue
    *   Up Votes / Down Votes

* Social Network

* Search

* Music Ranking/Voting System

* User Profiles/Stats

* Notification System

---
### **Routes:**
/ - landing page
/home - dashboard page
/home/profile - current user's profile page

---

### **Models:**
User
 * userId - number
 * username - string
 * email - string
 * firstName - string
 * lastName - string
 * password - string
 * timestamp - datetime
 * favoriteSongs - array ref: Song
 * joinedRooms - array ref: MusicRoom
 * ownedRooms - array ref: MusicRoom
 * friends - array ref: User

MusicRoom
 * roomId - number
 * title - string
 * description - string
 * users - array ref: User
 * chatlog - array of objects
 * playlist - array ref: Song
 * public - boolean
 * timestamps - datetime
 * _roomMembers - array ref: User
 * _owner - ref: User

Song
 * songId - number
 * title - string
 * artist - string
 * numOfVotes - number
 * timestamps - datetime