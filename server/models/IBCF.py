#!/usr/bin/env python
# coding: utf-8

# In[2]:


# train set의 모든 가능한 아이템 pair의 Cosine similarities 계산
from sklearn.metrics.pairwise import cosine_similarity
import pandas as pd
import sys
import pymysql.cursors

conn = pymysql.connect(host='localhost', port=3306, user='root', password='', db='itemdb', charset='utf8', autocommit=True, cursorclass=pymysql.cursors.DictCursor)
cursor1 = conn.cursor()
cursor2 = conn.cursor()
getlikedb="select * from likedb"
getitemdb="select * from itemdb"
cursor1.execute(getlikedb)
cursor2.execute(getitemdb)



likedb =cursor1.fetchall()
itemdb =cursor2.fetchall()

rating_data = pd.DataFrame(likedb)
item_data = pd.DataFrame(itemdb)
rating_data = rating_data.fillna(0)

rating_data = rating_data.transpose()
rating_data= rating_data.rename(columns=rating_data.iloc[0])



item_similarity = cosine_similarity(rating_data,rating_data)

item_similarity = pd.DataFrame(item_similarity, index=rating_data.index, columns=rating_data.index)


# 가중치는 주어진 아이템과 다른 아이템 간의 유사도(item_similarity)

def recommend_IBCF(item_id):
    return item_similarity[item_id].sort_values(ascending=False)[1:11]

# In[4]:
recommend_list =list(dict(recommend_IBCF(sys.argv[1])).keys()) #10개추천


# In[5]:


if __name__ == '__main__':
   # print ('파이썬 실행됨')
    print(recommend_list)
# In[ ]:




