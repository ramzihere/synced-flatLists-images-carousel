import React, { useEffect, useRef, useState } from 'react';
import {
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { fetchImagesFromPexels } from './helpers';
import { IMAGE_SIZE, SPACING } from './constants';
import { ImageData } from './types';

export default function ImageGallery() {
  const [data, setData] = useState<ImageData[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const { width, height } = useWindowDimensions();

  const topFlatlistRef = useRef<FlatList | null>(null);
  const thumbFlatlistRef = useRef<FlatList | null>(null);

  useEffect(() => {
    (async () => {
      const images = await fetchImagesFromPexels();
      setData(images);
    })();
  }, []);

  const scrollToActiveIndex = (index: number) => {
    setActiveIndex(index);
    topFlatlistRef.current?.scrollToOffset({
      offset: index * width,
      animated: true,
    });

    const scrollOffset =
      index * (IMAGE_SIZE + SPACING) - (width / 2 - IMAGE_SIZE / 2);
    thumbFlatlistRef.current?.scrollToOffset({
      offset: scrollOffset > 0 ? scrollOffset : 0,
      animated: true,
    });
  };

  const renderFullScreenItem = ({ item }: { item: ImageData }) => (
    <View style={{ width, height }}>
      <Image
        source={{ uri: item.src.portrait }}
        style={styles.fullScreenImage}
      />
    </View>
  );

  const renderThumbnailItem = ({
    item,
    index,
  }: {
    item: ImageData;
    index: number;
  }) => (
    <TouchableOpacity onPress={() => scrollToActiveIndex(index)}>
      <Image
        source={{ uri: item.src.portrait }}
        style={[
          styles.thumbnailImage,
          {
            borderColor: activeIndex === index ? '#fff' : 'transparent',
          },
        ]}
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="auto" />

      <FlatList
        ref={topFlatlistRef}
        data={data}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={({ nativeEvent }) => {
          scrollToActiveIndex(Math.floor(nativeEvent.contentOffset.x / width));
        }}
        renderItem={renderFullScreenItem}
        keyExtractor={(item) => item.id.toString()}
      />

      <FlatList
        ref={thumbFlatlistRef}
        data={data}
        horizontal
        pagingEnabled
        bounces={false}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.thumbnailContentContainer}
        style={styles.thumbnailContainer}
        renderItem={renderThumbnailItem}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  fullScreenImage: {
    ...StyleSheet.absoluteFillObject,
  },
  thumbnailContentContainer: {
    paddingHorizontal: SPACING,
  },
  thumbnailContainer: {
    position: 'absolute',
    bottom: IMAGE_SIZE,
  },
  thumbnailImage: {
    height: IMAGE_SIZE,
    width: IMAGE_SIZE,
    marginRight: SPACING,
    borderRadius: 12,
    borderWidth: 2,
  },
});
