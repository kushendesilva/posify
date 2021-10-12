import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, TouchableOpacity, Dimensions } from "react-native";
import { Icon, Text, Layout } from "@ui-kitten/components";
import Carousel from "react-native-anchor-carousel";
import { firebase } from "../configs/Database";
import SimplePaginationDot from "../components/SimplePaginationDot";
import AppColors from "../configs/AppColors";
import AppRenderIf from "../configs/AppRenderIf";

export default function AppCarousel(props) {
  const { width: windowWidth } = Dimensions.get("window");

  const INITIAL_INDEX = 0;

  const [banners, setBanners] = React.useState([]);

  const bannerRef = firebase.firestore().collection("banners");

  React.useEffect(() => {
    bannerRef.onSnapshot(
      (querySnapshot) => {
        const newBanner = [];
        querySnapshot.forEach((doc) => {
          const banner = doc.data();
          banner.id = doc.id;
          newBanner.push(banner);
        });
        setBanners(newBanner);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const carouselRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(INITIAL_INDEX);

  function handleCarouselScrollEnd(item, index) {
    setCurrentIndex(index);
  }

  function renderItem({ item, index }) {
    const { type, title, content } = item;
    return (
      <TouchableOpacity
        activeOpacity={1}
        style={styles.item}
        onPress={() => {
          carouselRef.current.scrollToIndex(index);
        }}
      >
        <Layout style={styles.lowerContainer}>
          {AppRenderIf(
            type == "offer",
            <Icon
              style={{ width: 30, height: 30, margin: "2%" }}
              fill={AppColors.primary}
              name="gift-outline"
            />
          )}
          {AppRenderIf(
            type == "alert",
            <Icon
              style={{ width: 30, height: 30, margin: "2%" }}
              fill={AppColors.primary}
              name="alert-triangle-outline"
            />
          )}
          <Text style={styles.titleText}>{title}</Text>
          <Text style={styles.contentText}>{content}</Text>
        </Layout>
      </TouchableOpacity>
    );
  }

  return (
    <Layout style={styles.container}>
      <Carousel
        style={styles.carousel}
        data={banners}
        renderItem={renderItem}
        itemWidth={0.8 * windowWidth}
        inActiveOpacity={0.3}
        containerWidth={windowWidth}
        onScrollEnd={handleCarouselScrollEnd}
        ref={carouselRef}
      />
      <SimplePaginationDot
        currentIndex={currentIndex}
        length={banners.length}
      />
    </Layout>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: AppColors.primary,
    paddingVertical: "6%",
    marginBottom: "2%",
  },
  carousel: {
    backgroundColor: AppColors.primary,
    aspectRatio: 3,
    flexGrow: 0,
    marginBottom: 20,
  },
  item: {
    flex: 1,
  },
  lowerContainer: {
    flex: 1,
    padding: "5%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
  },
  titleText: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center",
  },
  contentText: {
    marginTop: 10,
    fontSize: 12,
    textAlign: "center",
  },
});
