from flask import Flask,render_template,request,redirect,jsonify,make_response
import numpy as np 
from PIL import Image,ImageOps
import base64
import json
from io import BytesIO
import tensorflow as tf


app = Flask(__name__)


@app.route("/",methods=['GET','POST'])
def index():
    
    if request.method=="POST":
        img = request.form
            # print(img['imageBase64'])
            # print(img['imageBase64'],"---------------->>>")
        print("<---------------------------------->")
        img = img.to_dict()
        image = base64.b64decode(img['imageBase64'])
        image = Image.open(BytesIO(image))
            
        preproccessed_image = image_preprocessing(image)
        digit,accuracy = make_prediction(preproccessed_image)
        print(digit,accuracy)
        data={'dig':str(digit),'acc':str(accuracy*100)}
        
        print("<----------------------------------->")
        return jsonify(data)
    
    return render_template('index.html')

    
        
    # else:
    #     return render_template('index.html')

def image_preprocessing(img):
    img = img.convert("L")
    
    img = ImageOps.invert(img)
    img = img.resize((28,28),resample=Image.BILINEAR)
    
    img =np.resize(img,(1,28,28,1))
    img = np.array(img)
    img =img/255

    return img

def make_prediction(img):
    model = tf.keras.models.load_model('tf_model/model_digit.h5')
    prediction = model.predict(img)
    digit,accuracy = np.argmax(prediction[0]),max(prediction[0])
    return digit,accuracy



if __name__ == "__main__":
    app.run(debug=True)