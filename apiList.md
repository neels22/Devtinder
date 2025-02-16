
authRouter
POST /signup
POST /Login
POST /Logout

profileRouter
PATCH /profile/edit
GET /profile/view
PATCH /profile/updatepassword

connectionRequestRouter
Status: ignore , interest, accepted,rejected
POST /request/send/interested/:userId
POST /request/send/ignored/:userId
POST /request/review/accepted/:requestId
POST /request/review/rejected/:requestId

userRouter
GET /user/connections
GET /user/requests/received
GET /user/feed


