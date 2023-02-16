/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const onCreateTrip = /* GraphQL */ `
  subscription OnCreateTrip {
    onCreateTrip {
      id
      roadTraveled
      time {
        start
        end
      }
      user
      carID
      duration
      fee
      paidViaCreditCard
      paidViaWallet
      rating
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateTrip = /* GraphQL */ `
  subscription OnUpdateTrip {
    onUpdateTrip {
      id
      roadTraveled
      time {
        start
        end
      }
      user
      carID
      duration
      fee
      paidViaCreditCard
      paidViaWallet
      rating
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteTrip = /* GraphQL */ `
  subscription OnDeleteTrip {
    onDeleteTrip {
      id
      roadTraveled
      time {
        start
        end
      }
      user
      carID
      duration
      fee
      paidViaCreditCard
      paidViaWallet
      rating
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onCreateCar = /* GraphQL */ `
  subscription OnCreateCar {
    onCreateCar {
      id
      name
      location {
        lat
        lng
      }
      inUse
      battery
      Trips {
        items {
          id
          roadTraveled
          time {
            start
            end
          }
          user
          carID
          duration
          fee
          paidViaCreditCard
          paidViaWallet
          rating
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onUpdateCar = /* GraphQL */ `
  subscription OnUpdateCar {
    onUpdateCar {
      id
      name
      location {
        lat
        lng
      }
      inUse
      battery
      Trips {
        items {
          id
          roadTraveled
          time {
            start
            end
          }
          user
          carID
          duration
          fee
          paidViaCreditCard
          paidViaWallet
          rating
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
export const onDeleteCar = /* GraphQL */ `
  subscription OnDeleteCar {
    onDeleteCar {
      id
      name
      location {
        lat
        lng
      }
      inUse
      battery
      Trips {
        items {
          id
          roadTraveled
          time {
            start
            end
          }
          user
          carID
          duration
          fee
          paidViaCreditCard
          paidViaWallet
          rating
          createdAt
          updatedAt
          _version
          _deleted
          _lastChangedAt
        }
        nextToken
        startedAt
      }
      createdAt
      updatedAt
      _version
      _deleted
      _lastChangedAt
    }
  }
`;
