import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Button,StyleSheet,Modal } from 'react-native';
import { Card,Icon,Input } from 'react-native-elements';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { Rating } from 'react-native-ratings';
import { postFavorite ,postComment} from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
      dishes: state.dishes,
      comments: state.comments,
      favorites: state.favorites
    }
  }

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})  

function RenderComments(props) {

    const comments = props.comments;
            
    const renderCommentItem = ({item, index}) => {
        
        return (
            <View key={index} style={{margin: 10}}>
                <Text style={{fontSize: 14}}>{item.comment}</Text>
                <Rating
                style={{ alignItems: "flex-start" }}
                    imageSize={10}
                    readonly
                    startingValue={item.rating}
                />
                <Text style={{fontSize: 12}}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };
    
    return (
        <Card title='Comments' >
        <FlatList 
            data={comments}
            renderItem={renderCommentItem}
            keyExtractor={item => item.id.toString()}
            />
        </Card>
    );
}


function RenderDish(props) {

    const dish = props.dish;
    
        if (dish != null) {
            return(
                <Card
                    featuredTitle={dish.name}
                    image={{uri: baseUrl + dish.image}}>
                    <Text style={{margin: 10}}>
                        {dish.description}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon
                            raised
                            reverse
                            name={ props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon raised
                            style={styles.icon}
                            reverse
                            name='pencil'
                            type='font-awesome'
                            color='#4B0082'
                            onPress={() => props.addComment()} />
                    </View>
                </Card>
            );
        }
        else {
            return(<View></View>);
        }
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        }
    }
    toggleModal() {
        this.setState({ showModal: !this.state.showModal })
    }
    addComment() {
        this.toggleModal();
    }
    handleComment(comment) {
        this.props.postComment(comment.dishId, comment.rating, comment.author, comment.comment);
        this.toggleModal();
        
    }

    markFavorite(dishId) {
        this.props.postFavorite(dishId);
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    render() {
        const dishId = this.props.navigation.getParam('dishId','');
        var newComment = {
            dishId: dishId,
            rating: 3,
            author: '',
            comment: ''
        }
        return(
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={()=>this.markFavorite(dishId)}
                    addComment={() => this.addComment()}/>
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />

                <Modal animationType={"slide"} transparent={false}
                visible={this.state.showModal}
                onDismiss={() => this.toggleModal()}
                onRequestClose={() => this.toggleModal()}>
                <View style={styles.modal}>
                    <Rating
                        showRating
                        onFinishRating={(rating) => newComment.rating = rating}
                        style={{ paddingVertical: 10 }}
                    />
                    <View>
                        <Input
                            placeholder="Author"
                            onChangeText={(value) => newComment.author = value}
                            leftIcon={
                                <Icon
                                    name='user-o'
                                    type="font-awesome"
                                    size={24}
                                    color='black'
                                />} />
                    </View>
                    <View>
                        <Input
                            placeholder="Comment"
                            onChangeText={(value) => newComment.comment = value}
                            leftIcon={
                                <Icon
                                    name='comment-o'
                                    type="font-awesome"
                                    size={24}
                                    color='black'
                                />} />
                    </View>
                    <View style={{ marginBottom: 20 }}>
                        <Button
                            onPress={() => {
                                this.handleComment(newComment);
                                
                            }}
                            color="#512DA8"
                            title="Submit"
                            
                        />
                    </View>
                    <View>
                        <Button
                            onPress={() => { this.toggleModal(); }}
                            color="#D3D3D3"
                            title="Cancel"
                        />
                    </View>
                </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    icon: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }
})

export default connect(mapStateToProps,mapDispatchToProps)(Dishdetail);