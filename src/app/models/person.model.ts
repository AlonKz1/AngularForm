export interface Person
 {
  id: number
  firstName: string
  lastName: string
  email: string
  address: Address
  children: Child[]
 }

 export interface Child {
  name: string
  age: number
 }

 export interface Address {
  city: string
  street: string
 }
