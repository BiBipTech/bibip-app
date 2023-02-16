/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTrip = /* GraphQL */ `
  query GetTrip($id: ID!) {
    getTrip(id: $id) {
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
export const listTrips = /* GraphQL */ `
  query ListTrips(
    $filter: ModelTripFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listTrips(filter: $filter, limit: $limit, nextToken: $nextToken) {
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
  }
`;
export const syncTrips = /* GraphQL */ `
  query SyncTrips(
    $filter: ModelTripFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncTrips(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
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
  }
`;
export const getCar = /* GraphQL */ `
  query GetCar($id: ID!) {
    getCar(id: $id) {
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
export const listCars = /* GraphQL */ `
  query ListCars(
    $filter: ModelCarFilterInput
    $limit: Int
    $nextToken: String
  ) {
    listCars(filter: $filter, limit: $limit, nextToken: $nextToken) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
export const syncCars = /* GraphQL */ `
  query SyncCars(
    $filter: ModelCarFilterInput
    $limit: Int
    $nextToken: String
    $lastSync: AWSTimestamp
  ) {
    syncCars(
      filter: $filter
      limit: $limit
      nextToken: $nextToken
      lastSync: $lastSync
    ) {
      items {
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
      nextToken
      startedAt
    }
  }
`;
