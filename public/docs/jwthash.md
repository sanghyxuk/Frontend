### **JWT 해시 생성 가이드**

> 이 문서는 **프록시 서버 요청 시 `X-Auth-Token` JWT를 생성**하기 위한 해시 생성 기준을 설명합니다.  
> 요청 본문(`text`)은 반드시 정해진 방식으로 직렬화하여 해시해야 하며, 이 값을 JWT의 `hash` 필드에 넣어야 인증이 통과됩니다.

---

### **JSON 직렬화 규칙**

| 항목         | 설정값                            |
|--------------|-----------------------------------|
| 키 정렬       | `sort_keys = True`                |
| 공백 제거     | `separators = (',', ':')`         |
| 인코딩       | `UTF-8`로 바이트 인코딩           |
| 해시 알고리즘 | `SHA-256`                         |

> 위 기준을 따르지 않으면 **동일한 데이터라도 해시값이 달라져 JWT 인증이 실패**합니다.

---

### **Purgo API 작동 흐름도**


![Purgo API 시퀀스 다이어그램](/images/purgo-sequence-diagram.svg)

---

### **언어별 예시 코드**

<!-- LANGUAGE_TABS_HERE -->

---

### **JWT 구조 예시**

```json
{
  "iss": "your-system-name",
  "hash": "abc123...def456",         
  "iat": 1747314728,
  "exp": 1747315028
}
```

> 위 구조를 `HS256` 알고리즘으로 **서버에서 서명**한 후  
> `X-Auth-Token` 헤더에 포함해야 요청이 정상 인증됩니다.
