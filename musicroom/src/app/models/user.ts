export class User {
    constructor(
        public _id: number = null,
        public userId: number = null,
        public username: string = '',
        public email: string = '',
        public firstName: string = '',
        public lastName: string = '',
        public password: string = '',
        public description: string = '',
        public profileImageUrl: string = '',
        public isLoggedIn: boolean = false,
        public onlineFriends = [],
        public favoriteSongs = [],
        public joinedRooms = [],
        public ownedRooms = [],
        public friends = [],
        public received_invites = [],
        public sent_invites = [],
        public created_at: Date = new Date(),
        public updated_at: Date = new Date()
    ) {}
}