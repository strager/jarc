## Change object

A change object represents an event which occured which changed the state of the
server. Example change object types include disconnections, user messages, and
user renames.

A change object requires the following properties:

 - `id` - the ID of the change, which is unique for the entire change object
          collection. An ID is an integer. Change object ID's are sequential
          with respect to time.
 - `type` - the type of change the change object represents. Possible values
            are described below.
 - `time` - timestamp of the change. Format TBD.

Additionally, a change object may have the following properties, depending on
the type of the change:

 - `user` - user
 - `users` - users
 - `conv` - conversation
 - `srv` - server
 - `away` - `true` if a user is away; `false` otherwise
 - `msg` - message

Possible event types are:

 - `join` - a user has joined a conversation. The `user` property indicates
            which user joined; the `cnvo` property indicates which conversation
            the user joined.
 - `part` - a user has left a conversation.  The `user` property indicates which
            user left; the `conv` property indicates which conversation the
            user left.
 - `say` - a user spoke. The `user` property indicates which user spoke; the
           `msg` property contains the message the user sent.
 - `enter` - a user connected to a server. The `user` property, indicates which
             user connected; the `srv` property indicates which server the user
             connected to.
 - `exit` - a user disconnected from a server. The `user` property, indicates
            which user connected; the `srv` property indicates which server the
            user connected to.
 - `intro` - users in a conversation were discovered. The `users` property
             indicates the collection of users; the `conv` property indicates
             which conversation the users were discovered in. This change is
             used to differentiate between many users joining a conversation and
             the client joining a conversation with many present users.
 - `away` - a user's away status changed. The `user` property indicates which
            user had their away status changed; the `msg` property indicates an
            away message; the `away` property indicates whether the user is away
            or not.
 - `sys` - a system message was sent. The `srv`, `user`, and `conv` properties
           indicate, when set, which server, user, and conversation the system
           message was received from, respectively; the `msg` property indicates
           the system message sent.

## Methods

### GET /changes

Gets a collection of change objects

GET parameters:

 - `since` - get only the changes since the change indicated by this value (as
             ID).

Content types:

 - `application/json` - JSON object whose data is an array of change objects
