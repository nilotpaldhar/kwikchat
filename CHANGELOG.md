# [0.8.0](https://github.com/nilotpaldhar/storekeeper/compare/v0.7.1...v0.8.0) (2025-01-14)


### Bug Fixes

* **messenger-friends:** fix real-time issues in friend management functionality ([d2de78a](https://github.com/nilotpaldhar/storekeeper/commit/d2de78a12207f4ecd8f57dc2d432f5a4f965eab9))


### Features

* **group-chat:** add ability to modify group details to enhance group management ([fca4d04](https://github.com/nilotpaldhar/storekeeper/commit/fca4d04935c9c2d9d7cf03fbf51760004451c064))
* **group-chat:** add functionality for handling group exit and group deletion ([5ca1be2](https://github.com/nilotpaldhar/storekeeper/commit/5ca1be2c40b99450ea5a1c1bb7b883eeca3e7ac8))
* **messenger:** add ConversationsList component and reorganize Messenger folder structure ([d537e05](https://github.com/nilotpaldhar/storekeeper/commit/d537e05ec3befb60554a8c05ab2c62eb7fbcb893))
* **messenger:** add OnlineFriendsList and ChatWelcome components ([cfe2ae9](https://github.com/nilotpaldhar/storekeeper/commit/cfe2ae98d734c40a3e6b1730733f26960fd0b0ec))
* **messenger:** add real-time updates to the conversation list for instant message synchronization ([8434d70](https://github.com/nilotpaldhar/storekeeper/commit/8434d70b0fc92a286ebf5c11c1afcb81e7024998))
* **messenger:** implement chat deletion functionality with necessary validation and error handling ([5f0706b](https://github.com/nilotpaldhar/storekeeper/commit/5f0706b019f899f57e524224480e54a7782fc486))



## [0.7.1](https://github.com/nilotpaldhar/storekeeper/compare/v0.7.0...v0.7.1) (2024-12-06)


### Bug Fixes

* **auth:** replace bcryptjs with bcrypt-edge for auth compatibility in edge runtime ([c681d01](https://github.com/nilotpaldhar/storekeeper/commit/c681d01eca0d3d39d15ae7cffe86b3f9cfe6f010))



# [0.7.0](https://github.com/nilotpaldhar/storekeeper/compare/v0.6.0...v0.7.0) (2024-12-04)


### Features

* **group-chat:** add functionality to update group member roles and remove members ([7e3eae1](https://github.com/nilotpaldhar/storekeeper/commit/7e3eae19cf1d4545558c86655dd835ffba934a6a))
* **group-chat:** add group chat support, allowing users to create and join group conversations ([17a3e35](https://github.com/nilotpaldhar/storekeeper/commit/17a3e3520edc30ab43411ee2a32005770a88317c))
* **group-chat:** add group creation dialog with server-side handling ([13d3752](https://github.com/nilotpaldhar/storekeeper/commit/13d3752593c2dd84081109fd9e0faa0e7d8483e5))



# [0.6.0](https://github.com/nilotpaldhar/storekeeper/compare/v0.5.0...v0.6.0) (2024-10-17)


### Features

* **messenger-chat:** add chat screen ([40af9c4](https://github.com/nilotpaldhar/storekeeper/commit/40af9c476808b34433c0e9d4253b9732615e8ed0))
* **messenger-chat:** add ChatInput component with dynamic resizing and message handling ([1d8996f](https://github.com/nilotpaldhar/storekeeper/commit/1d8996ffcca199c87b7afa747331ae64feac6104))
* **messenger-chat:** add New Chat Dialog component with friend selection functionality ([11f2613](https://github.com/nilotpaldhar/storekeeper/commit/11f261306cc8a8b3a948099795b9eb92fc9fe1f4))
* **messenger-chat:** add real-time message updates for seamless user interaction ([5e499e1](https://github.com/nilotpaldhar/storekeeper/commit/5e499e108c8f951db98802dd38162f9c95e63ec0))
* **messenger-chat:** add support for displaying message reactions in chat messages ([da51203](https://github.com/nilotpaldhar/storekeeper/commit/da51203b5256f278f7ec46937025d7021eb91b17))
* **messenger-chat:** add support for starring messages in chat ([72de18d](https://github.com/nilotpaldhar/storekeeper/commit/72de18d198c571bb092c53f7126a848c8f8a0e46))
* **messenger-chat:** implement clear chat functionality and add message deletion feature ([ab6030c](https://github.com/nilotpaldhar/storekeeper/commit/ab6030c18373e4cb25e3076e8a30f53cdc4d7956))
* **messenger-chat:** implement functionality to open chat screen for user conversations ([7f024f9](https://github.com/nilotpaldhar/storekeeper/commit/7f024f94c4b2b9abe02e4a81f5b94b4285ae7e18))
* **messenger-chat:** implement private one-to-one chat with real-time messaging functionality ([8424d12](https://github.com/nilotpaldhar/storekeeper/commit/8424d12b3eeb25a21e9023440ddc309b87f04f6e))
* **messenger-chat:** implement real-time message seen status tracking ([2757ec9](https://github.com/nilotpaldhar/storekeeper/commit/2757ec9245de0ba1c8403c4a9cf296a67ca8ca80))



# [0.5.0](https://github.com/nilotpaldhar/storekeeper/compare/v0.4.0...v0.5.0) (2024-09-11)


### Bug Fixes

* **pusher:** fix pusher client initialization error ([72646f4](https://github.com/nilotpaldhar/storekeeper/commit/72646f4aa8ce2afe171f5a2389c6eff2a11edede))


### Features

* **messenger-friends:** add empty state for friends list ([6cff16b](https://github.com/nilotpaldhar/storekeeper/commit/6cff16b5b7dfff8c3d0d23cff621288d9958fa04))
* **messenger-friends:** add Friends, Online Friends, and Blocked Users pages ([ac21111](https://github.com/nilotpaldhar/storekeeper/commit/ac211111fad5f13f79c19458a60fc9e1446f14bc))
* **messenger-friends:** add paginated pending friend requests page and related API routes ([d18032d](https://github.com/nilotpaldhar/storekeeper/commit/d18032d6379e127d5e3193254a6deec2e74cec72))
* **messenger-friends:** add Pusher for real-time updates and subscribe to friend-related events ([409bc29](https://github.com/nilotpaldhar/storekeeper/commit/409bc2916188def1b77a762d7fa29a36b77fd988))
* **messenger-friends:** add send friend request API endpoint and implement frontend request form ([a13955e](https://github.com/nilotpaldhar/storekeeper/commit/a13955ea211da0b3134b72bf77baa2429d4a81c5))
* **messenger:** add API endpoints for listing, blocking, and unblocking users ([2813e9f](https://github.com/nilotpaldhar/storekeeper/commit/2813e9f76b2d368cc9354267941913a7b2b75683))
* **messenger:** add messenger layout ([23d7d8c](https://github.com/nilotpaldhar/storekeeper/commit/23d7d8c469214c1929e3cafa97b471297286340c))



