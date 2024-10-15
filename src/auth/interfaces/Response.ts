import { ApiProperty } from "@nestjs/swagger";

export class ResponseRegisterUserAndCheckStatus {
 
    @ApiProperty({
      example: "janedoe@gmail.com",
    })
    email: string;
   
    @ApiProperty({
      example: "Jane Doe",
    })
    fullname: string;
    
    @ApiProperty({
      example: "325c899a-ba17-4fd2-8f8d-90c4297c7815",
    })
    id: string;
    
    @ApiProperty({
      example: true,
    })
    IsActive: boolean;
    
    @ApiProperty({
      example: ["user"],
    })
    roles: string[];
   
    @ApiProperty({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjMyNWM4OTlhLWJhMTctNGZkMi04ZjhkLTkwYzQyOTdjNzgxNSIsImlhdCI6MTcxMTA2NDk5MSwiZXhwIjoxNzExMDcyMTkxfQ._tYWUyUwCZdQrwDGrUrOHbq5mlQBSP_hMfjsCN4oaKg",
    })
    token: string;
  }
  
  
  export class ResponseLoginUser {
   
    @ApiProperty({
      example: "eb394e4c-6b76-49f2-b4c8-cb4035af2eb9"
    })
    id: string;
   
    @ApiProperty({
      example: "test2@google.com"
    })
    email: string; 
    
    @ApiProperty({
      example: "$2b$10$KHCsuT6apkBd2Veoh3hXAud3XGnrMV41oqB/XSAjL30teGEXDj8um"
    })
    password: string;
    
    @ApiProperty({
      example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImViMzk0ZTRjLTZiNzYtNDlmMi1iNGM4LWNiNDAzNWFmMmViOSIsImlhdCI6MTcxMTA2NjY2MSwiZXhwIjoxNzExMDczODYxfQ.lyoFYaBNhYv2cRmtUWxGAHOWx7i-Wgbah06SBBLGwMY"
    })
    token: string; 
  }