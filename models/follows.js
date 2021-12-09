const { parse, serialize } = require("../utils/json");
const jsonDbPath = __dirname + "/../data/follows.json";
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
    constructor(dbPath = jsonDbPath, items = defaultItems) {
        this.jsonDbPath = dbPath;
        this.defaultItems = items;
    }

    getNextId() {
        const items = parse(this.jsonDbPath, this.defaultItems);
        let nextId;
        if (items.length === 0) nextId = 1;
        else nextId = items[items.length - 1].idFollow + 1;
        return nextId;
    }

    addOne(idFollower, idFollowed) {
        const items = parse(this.jsonDbPath, this.defaultItems);

        if (idFollower == idFollowed) return;
        //if (items.findIndex((f) => f.idUserFollowed == idFollowed && f.idUserFollower == idFollower) != -1) return;

        const newFollow = {
            idFollow: this.getNextId(),
            idUserFollowed: parseInt(idFollowed),
            idUserFollower: idFollower
        };
        items.push(newFollow);
        serialize(this.jsonDbPath, items);
        return newFollow;
    }

    deleteOne(idFollower, idFollowed) {
        const items = parse(this.jsonDbPath, this.defaultItems);
        const foundIndex = items.findIndex((item) => item.idUserFollowed == idFollowed && item.idUserFollower == idFollower);
        if (foundIndex < 0) return;
        const itemRemoved = items.splice(foundIndex, 1);
        serialize(this.jsonDbPath, items);
        return itemRemoved[0];
    }

    getFollowers(idUser) {
        const items = parse(this.jsonDbPath, this.defaultItems);
        return items.filter(f => f.idUserFollowed == idUser);
    }

    getFolloweds(idUser) {
        const items = parse(this.jsonDbPath, this.defaultItems);
        return items.filter(f => f.idUserFollower == idUser);
    }
}

module.exports = { Follows };