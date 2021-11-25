export interface UserModel {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    profileImage: string
    isDeleted: boolean
    createdAt: Date,
    updatedAt: Date,
}