export interface GetImg {
    imgid:  number;
    imgurl: string;
    uid : number;
    name : string;
    score:  number;
    isWinner: boolean;
    isLoser: boolean;
}
export interface Getranktoday {
    imgid:            number;
    imgurl:           string;
    name:             string;
    score:            number;
    uid:              number;
    rankingyesterday : number;
    rankingtoday :     number;
    rankdifferent : number;
}

export interface VoteImg {
    voteDate: string;
    totalScore: string;
    imgid: number;
    name : string;
    imgurl : string;
}

