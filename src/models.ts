export type UnicornColor = {
  pathId: string;
  color: string;
};

export type Unicorn = {
  _id?: string;
  nickname: string;
  createdAt?: string;
  phoneNo: string;
  colors: UnicornColor[];
  equipment: string;
};
