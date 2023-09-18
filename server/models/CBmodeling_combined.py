import pandas as pd
import matplotlib.pyplot as plt
import urllib.request
import sys
import random
import numpy as np
from gensim.models import Word2Vec
from gensim.models import KeyedVectors
from collections import Counter
import os
currentPath = os.getcwd()

# 모델 로드
loaded_model = KeyedVectors.load_word2vec_format(currentPath+"/models/word2vec_model") 
# 데이터베이스 불러오기
df = pd.read_csv(currentPath+'/models/Clustering_kmode.csv',encoding='utf-8')
df = df.drop(columns = ['Unnamed: 0'])
def match(res):
    #사용자가 버튼으로 입력하는 값을 db의 단어와 매칭하기 위한 db
    # 맛 V : '맛'으로 입력된다고 가정 -> '맛있다'로 변환
    word_dict = {'우유맛':'유제품맛','새콤':'신맛','달콤':'단맛','과일맛':'과일맛','맛':'맛있다','재구매의사':'있음','목넘김':'좋음'}
    for i in range(len(res)):
        word = res[i] 
        if word in word_dict:
            res[i] = word_dict[word]
    return res


# In[3]:


# cluster에서 각 row에 대해 filtering 하기 위한 1차 filtering
def filter(res):
    taste_detail = ['단맛','신맛','유제품맛','과일맛']
    func = ['피로회복','장건강','질건강','다이어트']
    t,td,fu,tex,rebuy,rresult = [],[],[],[],[],[]
    for i in res:
        if i =='맛있다':
            t.append(i)
        elif i in taste_detail:
            td.append(i)
        elif i in func:
            fu.append(i)
        elif i == '좋음':
            tex.append(i)
        elif i == '있음':
            rebuy.append(i)
   
    rresult.append(t)
    rresult.append(td)
    rresult.append(rebuy)
    rresult.append(tex)
    rresult.append(fu)
    
    return rresult


# In[4]:


#코사인 유사도 계산
def cosine_similar(random):
    cosine_df = pd.read_csv(currentPath+"/models/cosine_similarity.csv",encoding='utf-8')
    cos_sim = []
    target_text = cosine_df.iloc[random]
    


    for i in range(len(cosine_df)):
        cos_text = cosine_df.iloc[i]
        cos = np.dot(target_text, cos_text) / (np.linalg.norm(target_text)*np.linalg.norm(cos_text)) #코사인 유사도 식 구글링 통해서 검색 가능
        cos_sim.append(cos)

    cosine_df['cos_sim'] = cos_sim
    cosine_df = cosine_df.drop(columns=['Unnamed: 0'])
    new_result = cosine_df.sort_values(by='cos_sim',ascending=False)

    # 유사도 순으로 제품명 확인 (target : 맨 처음 제품)
    # 상위 5% 저장
    recommend_item = []
    for i in range(round(len(new_result)*0.05)):
        pos=new_result.index[i]
        recommend_item.append(df['ItemID'].iloc[pos])
    return recommend_item


# ## 사용자 입력

# In[ ]:
def RecommendItems(user_choice):

# 앱의 backend에서 버튼으로 입력받아오면 수정하기
    user_choice= user_choice.split(' ')

    result = []
    #사용자의 입력값 개수에 따라 6개 미만 - word2vec으로 6개 채워서 result 리스트로 반환
    #                            6개 이상인 경우 모두 result로 저장

    if len(user_choice) < 6 :
        w2v = loaded_model.most_similar(match(user_choice))
        require_num = 6-len(user_choice)
        for n in user_choice:
            result.append(n)
        for n in range(require_num):
            result.append(w2v[n][0])
    else: 
        result = match(user_choice)
        
    result = filter(result)
    # 사용자가 입력한 속성값과 일치하는 클러스터db 내 상품들 index 저장
    output = [[],[],[],[],[]]
    for i in range(2, df.shape[1]-2):
        for j in range(0, df.shape[0]):
            for item in range(len(result[i-2])):
                if result[i-2][item] == df.iloc[j,i]:
                    output[i-2].append(df.index[j])
                    
  
    output_flat = sum(output,[])
    output_flat = list(map(str,output_flat))

    rank = Counter(output_flat).most_common()

    rank_num = [] 
    items_first =[] #1순위
    items_second=[] #2순위
    num = list(rank)[-2:-1] 

    for i in rank:
        rank_num.append(i[1])
        ranks = set(rank_num)
        if i[1] == list(ranks)[-1]:
            items_first.append(i[0])
            
        if i[1] == num[0] :
            items_second.append(i[0])
            
    first,most_cluster = [],[]
    for i in items_first:
        first.append(df.iloc[int(i),7])
        
    clus = Counter(first).most_common()

    # 가장 많이 언급된 클러스터 순서대로 출력
    for i in range(len(Counter(first).most_common())):most_cluster.append(clus[i][0]) 
        
    # 가장 많이 언급된 클러스터 순서대로 , 언급된 횟수     
    #Counter(first).most_common()

    most = set(df[df.iloc[:,7]==most_cluster[0]]['ItemID'])
    
    choice_random = random.choice(list(most))
    result = set(cosine_similar(choice_random))
    print (result,end='')
    

# In[ ]:

if __name__ == '__main__':
   # print ('파이썬 실행됨')
    RecommendItems(sys.argv[1])



