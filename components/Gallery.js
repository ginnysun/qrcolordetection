import React, { Component } from "react";
import { Platform, StyleSheet, Text, View, Button } from "react-native";

class Gallery extends React.Component {
	static navigationOptions = {
    title: "Profile",
    headerStyle: {
      backgroundColor: "#73C6B6"
    }
  };
  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.headerText}>Gallery</Text>
        <Button
          title="Go to Home"
          onPress={() => this.props.navigation.navigate("Home")}
        />
        <Text style={styles.headerText}>Camera</Text>
        <Button
          title="Camera"
          onPress={() => this.props.navigation.navigate("Camera")}
        />
        <Text style={styles.headerText}> Go Back </Text>
        <Button
          title="Go Back"
          onPress={() => this.props.navigation.goBack()}
        />
        <Text style={styles.headerText}>This feature has not been implemented yet</Text>
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F5FCFF"
  },
  headerText: {
    fontSize: 20,
    textAlign: "center",
    margin: 10,
    fontWeight: "bold"
  }
});

export default Gallery;
