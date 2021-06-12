import React, {
  useState,
  useRef,
  useEffect,
  useImperativeHandle,
  forwardRef,
} from 'react';
import PropTypes from 'prop-types';
import { View, StyleSheet, Keyboard } from 'react-native';
import { AirbnbRating } from 'react-native-ratings';
import Colors from '../../../theme/colors';
import { Input, Spinner, Text } from '../../common';
import Sizes from '../../../theme/dimens';
import { Button } from '../../common';
import { Row, Spacer } from 'react-native-markup-kit';

const Required = () => <Text style={styles.required}>*</Text>;

const ReviewForm = forwardRef((props, ref) => {
  const [price, setPrice] = useState(0);
  const [value, setValue] = useState(0);
  const [quality, setQuality] = useState(0);
  const [nickname, setNickname] = useState('');
  const [summary, setSummary] = useState('');
  const [review, setReview] = useState('');
  const [submitEnabled, setSubmitEnabled] = useState(false);

  const nicknameEl = useRef(null);
  const summaryEl = useRef(null);
  const reviewEl = useRef(null);

  useEffect(() => {
    if (props.onMountRefs) {
      props.onMountRefs([
        nicknameEl.current,
        summaryEl.current,
        reviewEl.current,
      ]);
    }
  }, [props]);

  useEffect(() => {
    if (
      price &&
      value &&
      quality &&
      nickname.length &&
      summary.length &&
      review.length
    ) {
      setSubmitEnabled(true);
    } else {
      setSubmitEnabled(false);
    }
  }, [price, value, quality, nickname, summary, review]);

  useImperativeHandle(
    ref,
    () => ({
      reset: () => {
        setPrice(0);
        setValue(0);
        setQuality(0);
        setNickname('');
        setSummary('');
        setReview('');
      },
    }),
    [],
  );

  const onSubmit = () => {
    if (!nickname.length || !summary.length || !review.length) {
      alert('Please fill all required fields');
    } else {
      props.onSubmit(
        {
          price,
          value,
          quality,
          nickname,
          title: summary,
          detail: review,
        },
        props.ratingOptions,
      );
      Keyboard.dismiss();
    }
  };

  return (
    <View style={styles.container}>
      <Row>
        <Text style={styles.preview}>You're reviewing:</Text>
        <Spacer size={10} />
        <Text style={[styles.preview, styles.gray]}>{props.productName}</Text>
      </Row>
      <Spacer size={15} />
      <Text style={styles.ratingsTitle}>
        Your Rating <Required />
      </Text>
      <Spacer size={10} />
      <Row>
        <Text style={styles.ratingTitle}>Price</Text>
        <AirbnbRating
          showRating={false}
          size={20}
          onFinishRating={val => setPrice(val)}
          defaultRating={price}
        />
      </Row>
      <Spacer size={5} />
      <Row>
        <Text style={styles.ratingTitle}>Value</Text>
        <AirbnbRating
          showRating={false}
          size={20}
          onFinishRating={val => setValue(val)}
          defaultRating={value}
        />
      </Row>
      <Spacer size={5} />
      <Row>
        <Text style={styles.ratingTitle}>Quality</Text>
        <AirbnbRating
          showRating={false}
          size={20}
          onFinishRating={val => setQuality(val)}
          defaultRating={quality}
        />
      </Row>
      <Spacer size={15} />
      <Text style={styles.ratingsTitle}>
        Nickname <Required />
      </Text>
      <Spacer size={10} />
      <Input
        textContentType="username"
        ref={nicknameEl}
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCorrect={false}
        style={styles.input}
        value={nickname}
        onChangeText={val => setNickname(val)}
        onSubmitEditing={() => summaryEl.current.focus()}
      />
      <Spacer size={25} />
      <Text style={styles.ratingsTitle}>
        Summary <Required />
      </Text>
      <Spacer size={10} />
      <Input
        ref={summaryEl}
        underlineColorAndroid="transparent"
        returnKeyType="next"
        autoCorrect={false}
        style={styles.input}
        value={summary}
        onChangeText={val => setSummary(val)}
        onSubmitEditing={() => reviewEl.current.focus()}
      />
      <Spacer size={25} />
      <Text style={styles.ratingsTitle}>
        Review <Required />
      </Text>
      <Spacer size={10} />
      <Input
        ref={reviewEl}
        underlineColorAndroid="transparent"
        returnKeyType="send"
        autoCorrect={false}
        style={[styles.input, styles.reviewInput]}
        multiline={true}
        value={review}
        onChangeText={val => setReview(val)}
        numberOfLines={3}
        onSubmitEditing={onSubmit}
      />
      <Spacer size={25} />
      {props.loading ? (
        <Spinner />
      ) : (
        <View style={{ alignItems: 'center' }}>
          <Button
            titleColor="black"
            borderColor="black"
            disabled={!submitEnabled}
            onPress={onSubmit}
            style={{ borderRadius: 5 }}>
            Submit Review
          </Button>
        </View>
      )}
      <Spacer size={25} />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: Sizes.WINDOW_WIDTH * 0.9,
  },
  row: {
    flexDirection: 'row',
  },
  preview: {
    fontSize: 16,
  },
  gray: {
    color: Colors.reviewGray,
  },
  ratingsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  ratingTitle: {
    color: Colors.reviewGray,
    fontSize: 16,
    width: 70,
    alignSelf: 'center',
  },
  required: {
    color: Colors.error,
    fontSize: 12,
  },
  input: {
    width: Sizes.WINDOW_WIDTH * 0.9,
    backgroundColor: Colors.reviewInputBackground,
    padding: 10,
  },
  reviewInput: {
    height: 100,
  },
});

ReviewForm.propTypes = {
  productName: PropTypes.string,
  onMountRefs: PropTypes.func,
  onSubmit: PropTypes.func,
  loading: PropTypes.bool,
};

ReviewForm.defaultProps = {
  productName: '',
  onMountRefs: () => {},
  onSubmit: () => {},
  loading: false,
};

export default ReviewForm;
