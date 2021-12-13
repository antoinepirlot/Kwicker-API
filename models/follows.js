
const defaultItems = [
    {
        idFollow: 1,
        idUserFollowed: 1,
        idUserFollower: 2
    },
    {
        idFollow: 2,
        idUserFollowed: 2,
        idUserFollower: 1
    },
];
class Follows {
    constructor() {
    }

    addOne(idFollower, idFollowed) {
        return null;
    }

    deleteOne(idFollower, idFollowed) {
        return null;
    }

    getFollowers(idUser) {
        return null;
    }

    getFolloweds(idUser) {
        return null;
    }
}

module.exports = { Follows };