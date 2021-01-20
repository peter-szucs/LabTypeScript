import { NavigationContainer, RouteProp } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, FlatList, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface shoppingItem {
  id: number,
  title: string,
  price: number,
  description?: string,
  category?: string,
  image: string
}

type listItemProps = {
  item: shoppingItem,
  navigation: StackNavigationProp<StackParams, 'Catalog'>
}

type StackParams = {
  Catalog: undefined,
  ItemScreen: { id: number }
}

type MainScreenProps = {
  navigation: StackNavigationProp<StackParams, 'Catalog'>
}

type ItemViewScreenProps = {
  navigation: StackNavigationProp<StackParams, 'ItemScreen'>
  route: RouteProp<StackParams, 'ItemScreen'>
}

async function fetchCatalog(): Promise<shoppingItem[]> {
  const url =  'https://fakestoreapi.com/products'
  let catalog: shoppingItem[] = []
  let response = await fetch(url)
  
  if(response.status == 200) {
    let body: shoppingItem[] = await response.json()
    body.forEach((item: shoppingItem) => {
      
      catalog.push(item)
    })
    return catalog
  } else {
    return catalog
  }

}

async function fetchItem(id: number): Promise<shoppingItem> {
  const url = "https://fakestoreapi.com/products/" + id
  let item: shoppingItem
  let response = await fetch(url)
  item = await response.json()
  return item
}

function discountOrNot(price: number | undefined): boolean {
  if (price == undefined) {
    return false
  }
  else if (price > 50) {
    return false
  } 
  else {
    return true
  }
}

const ItemComponent = ({ item, navigation }: listItemProps) => {

  return (
    <TouchableOpacity 
      onPress={() => navigation.navigate('ItemScreen', {
        id: item.id })}>
      <View style={{ padding: 10, width: '80%' }}>
        <View style={{ 
          padding: 20, 
          borderRadius: 10,  
          flexDirection: 'row',
          }}
          >
          <Image 
            style={{ height: 80, width: 80 }}
            source = {{ uri: item.image }} />
          <View style={{ flexDirection: 'column' }}>
            <Text style={{ fontWeight: 'bold', padding: 10 }}>{item.title}</Text>
            <Text style={{ 
              color: discountOrNot(item.price) ? 'black' : 'green', 
              padding: 10 }}>
                ${item.price}
            </Text>
          </View>
          
        </View>
    </View>
    </TouchableOpacity>
  );
}

const MainScreen = ({ navigation }: MainScreenProps) => {
  
  const [data, setData] = useState<shoppingItem[]>([])

  useEffect(() => {
    async function loadData() {    
      let items: shoppingItem[] = await fetchCatalog();
      setData(items);
    }
    loadData();
  }, [])

  return (
    <View style={styles.container}>
      <SafeAreaView style={{ width: '100%', justifyContent: 'space-evenly', backgroundColor: 'white' }}>
        <FlatList
          style={{backgroundColor: '#f2f2f2', padding: 10}}
          data={data}
          renderItem={({ item, index }) => 
            <ItemComponent 
              item={item} 
              navigation={navigation}
              /> }
            ItemSeparatorComponent={() => {
              return (
                <View
                  style= {{ width: '100%', height: 1, backgroundColor: '#e2e2e2'}}>
                </View>
              )
            }}
          keyExtractor={(item, index) => index.toString()} />
      </SafeAreaView>
    </View>
  );
}

const ItemScreen = ({ navigation, route }: ItemViewScreenProps) => {
  const [itemInfo, setItemInfo] = useState<shoppingItem>();

  useEffect(() => {
    async function fetchItemInfo() {
      let item: shoppingItem = await fetchItem(route.params.id)
      navigation.setOptions({ title: item.title })
      setItemInfo(item)
    }
    fetchItemInfo();
  }, []);

  return (
    <SafeAreaView style={{ width: '100%', backgroundColor: 'white' }}>
      <View style={{ flexDirection: 'column', backgroundColor: 'white', height: '100%' }}>
        <Image 
          style={{ height: 200, width: 200, alignSelf: 'center', margin: 10 }}
          source={{ uri:  itemInfo?.image}}/>
        <Text style={{ fontWeight: 'bold', fontSize: 22, paddingHorizontal: 10 }}>{itemInfo?.title}</Text>
        <Text style={discountOrNot(itemInfo?.price) ? styles.regularPrice : styles.discountedPrice}>${itemInfo?.price}</Text>
        <Text style={{ paddingHorizontal: 10, fontWeight: 'bold' }}>Description</Text>
        <Text style={{ paddingHorizontal: 10 }}>{itemInfo?.description}</Text>
        <Text style={{ color: '#727272', padding: 10 }}>Category: {itemInfo?.category}</Text>
        <Button title="Add to Cart" onPress={() => console.log("Added to Cart")}></Button>
      </View>
    </SafeAreaView>
  );
}

const Stack = createStackNavigator<StackParams>();

export default function App() {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='Catalog'>
        <Stack.Screen 
          name="Catalog"
          component={MainScreen}
          options={{
            title: 'Catalog',
          }} 
        />
        <Stack.Screen
          name="ItemScreen"
          component={ItemScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center'
  },
  regularPrice: {
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10
  },
  discountedPrice: {
    color: 'green',
    fontSize: 20,
    fontWeight: 'bold',
    padding: 10
  },

});
