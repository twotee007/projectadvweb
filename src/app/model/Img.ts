

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
    imgid: number;
    name : string;
    voteDate: string;
    score: string;
    imgurl : string;
}

export interface ImgUser {
    imgid: number;
    uid : number;
    name : string;
    voteDate: string;
    score: string;
    imgurl : string;
    rankingyesterday : number;
    rankingtoday :     number;
    rankdifferent : number;
}

