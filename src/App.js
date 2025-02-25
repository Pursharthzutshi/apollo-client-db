import { useEffect, useState } from "react";
import DisplayData from "./DisplayData";
import { useQuery, useLazyQuery, gql, useMutation } from "@apollo/client";
import { v4 as uuidv4 } from "uuid";
import "./App.css";
function App() {
  //get by varaible
  // const getMovieByName = gql`
  //   query Movie($name:String!){
  //       movie(name:$name){
  //           name
  //           yearOfPublication
  //       }
  //   }
  //   `
  const getUserByName = gql`
    query User($name: String) {
      user(name: $name) {
        name
      }
    }
  `;

  //create user mutation

  const createUserMutation = gql`
    mutation CreateUser($user: userInputType!) {
      createUser(user: $user) {
        uid
        name
      }
    }
  `;
  const deleteUserMutation = gql`
    mutation DeleteUser($uid: ID!) {
      deleteUser(uid: $uid) {
        uid
      }
    }
  `;

  const updateUsernameMutation = gql`
    mutation updateUsername($updateUsername: updateUsernameType) {
      updateUsername(updateUsername: $updateUsername) {
        uid
        username
      }
    }
  `;

  // client.cache.writeQuery({
  //   query:createUserMutation
  //   // data{cr}
  // // fields:{
  // // }
  // })

  const [movieSearch, setMovieSearched] = useState("");

  //delete

  const [deleteId, setDeleteId] = useState("");

  //create post states

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState(0);
  const [nationality, setNationality] = useState("");

  const [uid, setUid] = useState("");
  const [newUsername, setNewUsername] = useState("");

  const { data, loading, error, refetch, Query_all_Users } = DisplayData();

  const [fetchUserDataByName, { data: FindUserByName }] =
    useLazyQuery(getUserByName);

  const [
    deleteUserPost,
    {
      data: deleteUserPostData,
      loading: deleteUserLoading,
      error: deleteUserError,
    },
  ] = useMutation(deleteUserMutation, {
    onCompleted: (data) => {
      console.log("User deleted:", data);
    },
    onError: (error) => {
      console.log(error);
    },

    // refetchQueries:[{query:Query_all_Users}]
  });

  const [updateUserPost, { data: UpdatedData }] = useMutation(
    updateUsernameMutation,
    {
      onCompleted: (data) => {
        console.log("User deleted:", data);
      },
      onError: (error) => {
        console.log(error);
      },
    }
  );

  // useEffect(()=>{
  //   console.log(Query_all_Users)
  // })
  const [createUserPost, { loading: createUserPostLoading }] = useMutation(
    createUserMutation,
    {
      update(cache, { data: { das } }) {
        let fakedata = {
          uid: "1",
          name: "jimmy",
          username: "JM",
          age: 26,
          nationality: "USA",
        };
        cache.writeQuery({
          query: Query_all_Users,
          data: {
            UserList: [],
          },
        });
        const data = cache.readQuery({ query: Query_all_Users });
        console.log(data);
      },
      // refetchQueries: [{ query: Query_all_Users }],

      onCompleted: (data) => {
        // refetch()
        console.log("User deleted:", data);
        // Optionally refetch data here
      },
      //     onError:(error)=>{
      //   console.log(error);
      // },

      // refetchQueries: [{ query: Query_all_Users }],
    }
  );

  //   if(createUserPostLoading){
  //   console.log(deleteUserPostData)
  // }
  // useEffect(()=>{
  //   console.log(data)
  //   console.log(FindUserByName)
  // })

  if (loading) return <div>spinner</div>;
  function formPrevent(e) {
    e.preventDefault();
  }
  return (
    <div className="App">
      <input
        className="delete-input"
        type="text"
        placeholder="select delete id"
        onChange={(e) => {
          setDeleteId(e.target.value);
        }}
      />
      <button
        className="delete-button"
        onClick={async () => {
          await deleteUserPost({
            variables: {
              uid: deleteId,
            },
          });
        }}
      >
        Delete
      </button>

      {/* data.UserList.length > 0 && */}

      {data.UserList.map((val) => {
        return (
          <div>
            <h3>ID</h3>
            <p>{val.uid}</p>
            <p>{val.name}</p>
            <p>{val.age}</p>
            <p>{val.username}</p>
          </div>
        );
      })}

      <input
        type="text"
        placeholder="user name"
        onChange={(e) => {
          setMovieSearched(e.target.value);
        }}
      />

      <button
        onClick={() => {
          fetchUserDataByName({
            variables: {
              name: movieSearch,
            },
          });
        }}
      >
        Fetch Data By Name
      </button>

      <div>
        <h4>Create New Post</h4>
        {/* 
<input placeholder="name" type="text" onChange={(e)=>{setName(e.target.value)}}/> */}

        <form className="add-post-form" onSubmit={formPrevent}>
          <input
            placeholder="Name"
            type="text"
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <input
            placeholder="Username"
            type="text"
            onChange={(e) => {
              setUsername(e.target.value);
            }}
          />
          <input
            placeholder="Age"
            type="number"
            onChange={(e) => {
              setAge(e.target.value);
            }}
          />
          <input
            placeholder="Nationality"
            type="text"
            onChange={(e) => {
              setNationality(e.target.value.toUpperCase());
            }}
          />

          <button
            className="add-button"
            onClick={() => {
              createUserPost({
                variables: {
                  user: {
                    uid: uuidv4(),
                    name,
                    username,
                    age: Number(age),
                    nationality,
                  },
                },
              });
            }}
          >
            Add user post
          </button>
        </form>

        <form className="add-post-form" onSubmit={formPrevent}>
          <input
            placeholder="select update id"
            type="text"
            onChange={(e) => {
              setUid(e.target.value);
            }}
          />

          <input
            placeholder="Update Name"
            type="text"
            onChange={(e) => {
              setNewUsername(e.target.value);
            }}
          />

          <button
            className="update-button"
            onClick={() => {
              updateUserPost({
                variables: {
                  updateUsername: { uid, newUsername },
                },
              });
            }}
          >
            Update user post
          </button>
        </form>

        {FindUserByName && <p>{FindUserByName.user.name}</p>}
      </div>
    </div>
  );
}

export default App;
