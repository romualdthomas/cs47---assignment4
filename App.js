import { Image, Pressable, StyleSheet, SafeAreaView, Text, View, FlatList } from "react-native";
import { useSpotifyAuth } from "./utils";
import { Themes } from "./assets/Themes";
import SpotifyIcon from "./assets/spotify-logo.png"
import millisToMinutesAndSeconds from "./utils/millisToMinutesAndSeconds.js"
import { render } from "react-dom";
import { AntDesign } from '@expo/vector-icons'; 
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import { WebView } from 'react-native-webview';
import 'react-native-gesture-handler';


const SongItem = ({ pic, song, artist, album, time, }) => {
  return (
    <View style={{flexDirection: 'row'}}>
      <View style={{  }}>
        <Image source={pic} style={{ width: 64, height: 64, marginRight: 10,  }} />
      </View>
      <View style={{  }} numberOfLines={1}>
        <Text style={{ color: "#FFFFFF", fontSize: 20, marginRight: 10 }} numberOfLines={1}>{song}</Text>
        <Text style={{ color: "#B3B3B3", fontSize: 20, marginRight: 10 }} numberOfLines={1}>{artist}</Text>
      </View>
      <View style={{  }} numberOfLines={1}>
        <Text style={{ color: "#B3B3B3", fontSize: 20, marginRight: 10 }} numberOfLines={1}>{album}</Text>
      </View>
      <View style={{  }} numberOfLines={1}>
        <Text style={{ color: "#B3B3B3", fontSize: 20 }} numberOfLines={1}>{time}</Text>
      </View>
    </View>
  )
}


export default function App() {
  // Pass in true to useSpotifyAuth to use the album ID (in env.js) instead of top tracks
  const Stack = createStackNavigator();

  const SpotifyAuthButton = ({ spotFunction}) => {
    return (
      <Pressable
        onPress={spotFunction}
        style={({ pressed }) => [
          {
            backgroundColor: pressed
              ? 'rgb(210, 230, 255)'
              : '#1DB954'
          },
          styles.wrapperCustom
        ]}
      >
        <View style={styles.card}>
          <View>
            <Image source={SpotifyIcon} style={{ width: 40, height: 40, marginRight: 10 }} />
          </View>
          <View>
            <Text style={{ color: "white", fontWeight: "bold" }}>Connect with Spotify</Text>
          </View>
        </View>
      </Pressable>
    )
  }

  const PreviewScreen = ({navigation, route}) => {
    const address = route.params.address
    return (
      <WebView source={{ uri: address }}/>
    )
  }

  const SongScreen = ({navigation, route}) => {
    const address = route.params.address
    return (
      <WebView source={{ uri: address }}/>
    )
  }

  const renderSongs = (props, navigation) => {
    const { item } = props;
    return (
      <View style={styles.card2}>
        <View style={{ paddingLeft: 20 }}>
          <Pressable style={{justifyContent:'center', alignSelf:'auto'}} onPress= {(e) => {
            e.stopPropagation();
            navigation.navigate('PreviewScreen', {
              address: item.preview_url,
            });
          }}>
            <AntDesign name="play" size={24} color="#1DB954" />
          </Pressable>
        </View>
        <View>
          <Pressable
            onPress= {() => {
              navigation.navigate('SongScreen', {
                address: item.external_urls.spotify,
              });
          }}>
            <SongItem
              pic={item.album.images[2]}
              song={item.name}
              artist={item.artists[0].name}
              album={item.album.name}
              time={millisToMinutesAndSeconds(item.duration_ms)}
            />
          </Pressable>
        </View>
      </View>
    )
  }

  
 
  const DisplayTracks = ({navigation}) => {
    const { token, tracks, getSpotifyAuth } = useSpotifyAuth();
    return (
      token ?
        <SafeAreaView style={styles.container2}>
          <View style={styles.list}>
            <View style={styles.card}>
              <View>
                <Image source={SpotifyIcon} style={{ width: 40, height: 40, marginRight: 10 }} />
              </View>
              <View>
                <Text style={{ color: "white", fontWeight: "bold", fontSize: 20 }}>My Top Tracks</Text>
              </View>
            </View>
            <FlatList
              data={tracks}
              renderItem={(item) => renderSongs(item, navigation)}
              keyExtractor={(item) => item.id}
            />
          </View>
        </SafeAreaView>
        :
        <SafeAreaView style={styles.container}>
          <SpotifyAuthButton spotFunction={getSpotifyAuth}/>
        </SafeAreaView>
    )
  }

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="HomeScreen" component={DisplayTracks} options={{headerShown: false}}/>
        <Stack.Screen name="SongScreen" component={SongScreen} />
        <Stack.Screen name="PreviewScreen" component={PreviewScreen} />
      </Stack.Navigator>
  </NavigationContainer>

  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Themes.colors.background,
    justifyContent: "center",
    alignItems: "center",
    flex: 1,
  },

  list: {
    height: "100%",
    width: "100%",
  },


  container2: {
    backgroundColor: Themes.colors.background,
    alignItems: "center",
    flex: 1,
  },
  wrapperCustom: {
    borderRadius: 99999,
    padding: 15
  },
  card: {
    alignItems: "center",
    justifyContent: "space-evenly",
    flexDirection: "row",
  },
  card2: {
    alignItems: "center",
    flexDirection: "row",
    marginTop: 20,
    width: "100%",
  }
});
