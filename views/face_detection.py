import cv2
import time
import numpy as np
count=0
faces = cv2.CascadeClassifier('dard.xml')
img = cv2.imread("face.jpg")
while count<3:
    gray_image = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    face = faces.detectMultiScale(gray_image, 2, 1)
    for (x, y, w, h) in face:
        cv2.rectangle(img, (x,y), (x+w, x+h), (255,0,0), 2)
        out = img[y:y+h, x:x+w]
        count=count+1
        cv2.imwrite('output'+str(count)+'.jpg',out)
	
cv2.destroyWindow("preview")
