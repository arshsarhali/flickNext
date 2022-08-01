export async function queryHasuraGQL(
	operationsDoc,
	operationName,
	variables,
	token
) {
	const result = await fetch(process.env.HASURA_ADMIN_URL, {
		method: 'POST',
		headers: {
			Authorization: `Bearer ${token}`,
			'Content-type': 'application/json',
		},
		body: JSON.stringify({
			query: operationsDoc,
			variables: variables,
			operationName: operationName,
		}),
	})

	return await result.json()
}

export async function isNewUser(token, issuer) {
	const operationsDoc = `
  query isNewUser($issuer: String!) {
    users(where: {issuer: {_eq: $issuer}}) {
      id
      email
      issuer
      publicAddress
    }
  }
`
	const response = await queryHasuraGQL(
		operationsDoc,
		'isNewUser',
		{ issuer },
		`${token}`
	)

	return response?.data?.users?.length === 0
}

export async function createNewUser(token, metadata) {
	const operationsDoc = `
  mutation createNewUser($issuer: String!, $email: String!, $publicAddress: String!) {
    insert_users(objects: {email: $email, issuer: $issuer, publicAddress: $publicAddress}) {
      returning {
        email
        id
        issuer
        publicAddress
      }
    }
  }
`

	const { issuer, email, publicAddress } = metadata
	const response = await queryHasuraGQL(
		operationsDoc,
		'createNewUser',
		{ issuer, email, publicAddress },
		`${token}`
	)

	return response
}

export async function findVideoIdByUser(token, userId, videoId) {
	const operationsDoc = `
  query findVideoIdByUserId($userId: String!, $videoId: String!) {
    stats(where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`

	const response = await queryHasuraGQL(
		operationsDoc,
		'findVideoIdByUserId',
		{ userId, videoId },
		`${token}`
	)

	return response?.data?.stats
}

export async function insertStats(
	token,
	{ favourited, userId, watched, videoId }
) {
	const operationsDoc = `
  mutation insertStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId:String!) {
    insert_stats_one(object: {favourited: $favourited, userId: $userId, videoId: $videoId, watched: $watched}) {
      favourited
      id
      userId
      videoId
      watched
    }
  }
`

	const response = await queryHasuraGQL(
		operationsDoc,
		'insertStats',
		{ favourited, userId, watched, videoId },
		`${token}`
	)

	return response
}

export async function updateStats(
	token,
	{ favourited, userId, watched, videoId }
) {
	const operationsDoc = `
mutation updateStats($favourited: Int!, $userId: String!, $watched: Boolean!, $videoId:String!) {
    update_stats(_set: {favourited: $favourited,watched: $watched}, where: {userId: {_eq: $userId}, videoId: {_eq: $videoId}}) {
      affected_rows
    }
  }
`

	const response = await queryHasuraGQL(
		operationsDoc,
		'updateStats',
		{ favourited, userId, watched, videoId },
		`${token}`
	)

	return response
}

export async function getWatchedVideos(userId, token) {
	const operationsDoc = `
  query watchedVideos($userId: String!) {
    stats(where: {userId: {_eq: $userId}, watched: {_eq: true}}) {
      videoId
    }
  }
`

	const response = await queryHasuraGQL(
		operationsDoc,
		'watchedVideos',
		{ userId },
		`${token}`
	)

	return response?.data?.stats
}

export async function myListVideos(userId, token) {
	const operationsDoc = `
  query myList($userId: String!) {
    stats(where: {favourited: {_eq: 2}, userId: {_eq: $userId}}) {
      videoId
    }
  }
`

	const response = await queryHasuraGQL(
		operationsDoc,
		'myList',
		{ userId },
		`${token}`
	)

	return response?.data?.stats
}
